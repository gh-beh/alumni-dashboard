export interface Merchant {
    description: string,
    image: string,
    notificationId: number,
    title: string,
    push: number,
}

export const NULL_NOTIF = {
    description: '',
    image: '',
    notificationId: 0,
    title: '',
    push: 0,
};
