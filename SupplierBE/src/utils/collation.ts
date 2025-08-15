import { Repository, ObjectLiteral, SelectQueryBuilder } from 'typeorm';

interface IColumnOrderBy {
    column: string;
    direction?: 'ASC' | 'DESC';
}

interface IWhere {
    column: string;
    value: any;
    tableAlias?: string;
    operator?: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN';
}

interface IJoinConfig {
    relationName: string;
    tableAlias: string;
    condition?: string;
    extraCondition?: string[];
}

interface ISearchOptions {
    where?: IWhere | IWhere[];
    orderBy?: IColumnOrderBy | IColumnOrderBy[];
    page?: number;
    limit?: number;
    exactMatchFields?: string[];
    leftJoin?: IJoinConfig[];
}

type SearchResult<T> = [T[], number];

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_ORDER_COLUMN = 'id';
const DEFAULT_ORDER_DIRECTION: 'ASC' | 'DESC' = 'ASC';
const COLLATION_RULE = 'SQL_Latin1_General_CP1_CI_AI';

const STRING_COLUMN_TYPES = new Set([String, 'varchar', 'nvarchar', 'text', 'char', 'nchar']);

const NUMERIC_COLUMN_TYPES = new Set([
    Number,
    'int',
    'bigint',
    'decimal',
    'float',
    'double',
    'real',
    'smallint',
    'tinyint',
]);

const validatePaginationParams = (page?: number, limit?: number): { page: number; limit: number } => {
    const validatedPage = Math.max(1, page || DEFAULT_PAGE);
    const validatedLimit = Math.max(1, Math.min(1000, limit || DEFAULT_LIMIT));
    return { page: validatedPage, limit: validatedLimit };
};

const getDatabaseColumnName = (alias: string, columnName: string, tableAlias?: string): string => {
    const targetAlias = tableAlias || alias;
    return `${targetAlias}.${columnName}`;
};

const generateParameterName = (field: string, index?: number): string => {
    return index !== undefined ? `${field}_${index}` : field;
};

const applyStringFilter = <T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    dbCol: string,
    field: string,
    value: string,
    isExact: boolean,
    paramIndex?: number,
): void => {
    const paramName = generateParameterName(field, paramIndex);

    if (isExact) {
        qb.andWhere(`${dbCol} = :${paramName}`, { [paramName]: value });
    } else {
        qb.andWhere(`${dbCol} COLLATE ${COLLATION_RULE} LIKE :${paramName}`, { [paramName]: `%${value}%` });
    }
};

const applyNumericFilter = <T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    dbCol: string,
    field: string,
    value: number | string,
    isExact: boolean,
    paramIndex?: number,
): void => {
    const paramName = generateParameterName(field, paramIndex);

    if (isExact) {
        qb.andWhere(`${dbCol} = :${paramName}`, { [paramName]: value });
    } else {
        qb.andWhere(`CAST(${dbCol} AS NVARCHAR) LIKE :${paramName}`, { [paramName]: `%${value}%` });
    }
};

const applyWhereConditions = <T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    whereConditions: IWhere | IWhere[],
    alias: string,
): void => {
    const conditions = Array.isArray(whereConditions) ? whereConditions : [whereConditions];

    conditions.forEach((condition, index) => {
        if (condition.value === undefined) return;

        const { column, value, tableAlias, operator = '=' } = condition;
        const dbCol = getDatabaseColumnName(alias, column, tableAlias);
        const paramName = generateParameterName(column, index);

        switch (operator) {
            case 'LIKE':
                qb.andWhere(`${dbCol} LIKE :${paramName}`, { [paramName]: `%${value}%` });
                break;
            case 'IN':
                if (Array.isArray(value) && value.length > 0) {
                    qb.andWhere(`${dbCol} IN (:...${paramName})`, { [paramName]: value });
                }
                break;
            default:
                qb.andWhere(`${dbCol} ${operator} :${paramName}`, { [paramName]: value });
        }
    });
};

const applyOrdering = <T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    orderBy: IColumnOrderBy | IColumnOrderBy[],
    alias: string,
): void => {
    const orders = Array.isArray(orderBy) ? orderBy : [orderBy];

    orders.forEach((order, index) => {
        const { column, direction = DEFAULT_ORDER_DIRECTION } = order;
        const dbCol = `${alias}.${column}`;

        if (index === 0) {
            qb.orderBy(dbCol, direction);
        } else {
            qb.addOrderBy(dbCol, direction);
        }
    });
};

/**
 * Enhanced search function with collation support and optimized query building
 * @param repo - TypeORM repository instance
 * @param alias - Main table alias for the query
 * @param filters - Key-value pairs for filtering data
 * @param options - Additional search options (pagination, joins, ordering, etc.)
 * @returns Promise<[results[], totalCount]>
 */
export async function searchWithCollate<T extends ObjectLiteral>(
    repo: Repository<T>,
    alias: string,
    filters: Record<string, any>,
    options?: ISearchOptions,
): Promise<SearchResult<T>> {
    const {
        orderBy = { column: DEFAULT_ORDER_COLUMN, direction: DEFAULT_ORDER_DIRECTION },
        exactMatchFields = [],
        leftJoin,
        where,
    } = options || {};

    const { page, limit } = validatePaginationParams(options?.page, options?.limit);

    const qb = repo.createQueryBuilder(alias);
    const columns = repo.metadata.columns;

    // left joins
    if (leftJoin && leftJoin.length > 0) {
        leftJoin.forEach((join) => {
            qb.leftJoinAndSelect(`${alias}.${join.relationName}`, join.tableAlias, join.condition);

            if (Array.isArray(join.extraCondition) && join.extraCondition.length > 0) {
                join.extraCondition.forEach((condition) => {
                    qb.andWhere(condition);
                });
            }
        });
    }

    // Apply filters based on column metadata
    for (const [field, value] of Object.entries(filters)) {
        if (value == null || value === '') continue;

        // Find column metadata
        const columnMeta = columns.find((col) => col.propertyName === field);
        if (!columnMeta) {
            console.warn(`Column metadata not found for field: ${field}`);
            continue;
        }

        const dbCol = getDatabaseColumnName(alias, columnMeta.databaseName);
        const isExact = exactMatchFields.includes(field);

        // Apply filter based on column type
        if (STRING_COLUMN_TYPES.has(columnMeta.type as any)) {
            applyStringFilter(qb, dbCol, field, String(value), isExact);
        } else if (NUMERIC_COLUMN_TYPES.has(columnMeta.type as any)) {
            applyNumericFilter(qb, dbCol, field, value, isExact);
        } else {
            // Default exact match for other types (dates, booleans, etc.)
            qb.andWhere(`${dbCol} = :${field}`, { [field]: value });
        }
    }

    // Apply additional where conditions
    if (where) {
        applyWhereConditions(qb, where, alias);
    }

    // Apply ordering
    if (orderBy) {
        applyOrdering(qb, orderBy, alias);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    qb.skip(offset).take(limit);

    // Execute query and return results
    try {
        return await qb.getManyAndCount();
    } catch (error) {
        console.error('Error executing search query:', error);
        throw new Error(`Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
