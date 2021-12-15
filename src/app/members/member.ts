export interface Member {
    name: string,
    id: string,
    email: string,
    contactNo: string,
    addr: string,
    city: string,
    gradUni: string,
    gradYear: number,
    gradProg: string,
}

export const NULL_MEMBER: Member = {
    name: '',
    id: '',
    email: '',
    contactNo: '',
    addr: '',
    city: '',
    gradUni: '',
    gradYear: 0,
    gradProg: '',
};

export const MOCK_MEMBERS: Member[] = [
    {
        name: 'Lee Yew Tong',
        id: 'J123456789',
        email: 'Lyt1123@gmail.com',
        contactNo: '016-3426671',
        addr: '2, Jalan Seni, Bandar Damansara',
        city: 'KL',
        gradUni: 'IICS',
        gradYear: 2019,
        gradProg: 'Diploma in Business',
    },
    {
        name: 'Ali Abdul',
        id: 'J123456790',
        email: 'Ali188@hotmail.com',
        contactNo: '018-2174514',
        addr: '73, Jalan Kepong 1/2a, Kepong',
        city: 'Selangor',
        gradUni: 'IU',
        gradYear: 2018,
        gradProg: 'Diploma in Information Technology',
    },
    {
        name: 'Ashley Yap',
        id: 'J123456791',
        email: 'ash_yap7@live.com',
        contactNo: '012-9022445',
        addr: '135, Jalan SD 2, Bandar Semoga',
        city: 'KL',
        gradUni: 'IICS',
        gradYear: 2017,
        gradProg: 'Diploma in Business',
    },
];
