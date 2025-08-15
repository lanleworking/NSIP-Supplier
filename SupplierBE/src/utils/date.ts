type DateOptions = {
    toMilliseconds?: boolean;
};

export const nextDayMidnight = (date: Date, options?: DateOptions): Date | number => {
    const nextDay = new Date(date);
    nextDay.setHours(0, 0, 0, 0);
    nextDay.setDate(nextDay.getDate() + 1);
    if (options?.toMilliseconds) {
        return nextDay.getTime();
    }
    return nextDay;
};
