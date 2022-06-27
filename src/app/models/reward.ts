export interface Reward {
    code: string,
    description: string,
    endDate: string,
    expiryDate: string,
    expiryDay: number,
    expiryType: number,
    image: string,
    merchantId: number,
    merchantName: string,
    startDate: string,
    status: string,
    title: string,
    voucherClaimableAmount: number,
    voucherId: number,
    voucherLimit: number
}

export const NULL_REWARD = {
    code: '',
    createdDate: '',
    description: '',
    endDate: '',
    expiryDate: '',
    expiryDay: 0,
    expiryType: 0,
    image: '',
    merchantId: 0,
    merchantName: '',
    modifiedDate: '',
    startDate: '',
    status: '',
    title: '',
    voucherClaimableAmount: 0,
    voucherId: 0,
    voucherLimit: 0
};
