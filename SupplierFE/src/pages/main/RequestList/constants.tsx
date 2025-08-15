export const REQUEST_KEYS = ['Id_Request', 'Request', 'TimeLimit']

export const REQUEST_TABLE_HEADERS = [
  {
    name: 'Request',
    label: 'Yêu cầu',
  },
  {
    name: 'SentStatus',
    label: 'Trạng thái gửi',
  },
  {
    name: 'TimeLimit',
    label: 'Thời hạn',
  },
  {
    name: 'ApprovalStatus',
    label: 'Trạng thái duyệt',
  },
  {
    name: 'confirmAt',
    label: 'Ngày gửi',
  },
  {
    name: 'Id_Request',
    label: 'ID',
  },
]

export const APPROVAL_STATUS = {
  0: {
    label: 'Chờ duyệt',
    color: 'gray',
  },
  1: {
    label: 'Đã duyệt',
    color: 'green',
  },
  8: {
    label: 'Từ chối',
    color: 'red',
  },
}
