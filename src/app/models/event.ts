export interface IntiEvent {
    eventId: number,
    name: string,
    description: string,
    image: string,
    registerLink: string,
    startDate: string,
    endDate: string,
    status: string,
}

export const NULL_EVENT: IntiEvent = {
    eventId: 0,
    name: '',
    description: '',
    image: '',
    registerLink: '',
    startDate: '',
    endDate: '',
    status: '',
};

export const MOCK_EVENTS: IntiEvent[] = [
    {
        eventId: 1,
        name: 'Event 1',
        description: 'Default description for events',
        image: 'https://uowplaybook.s3-ap-southeast-2.amazonaws.com/logo/logo-secondary.png',
        registerLink: 'https://www.google.com',
        startDate: '1/1/2021',
        endDate: '1/1/2021',
        status: 'closed',
    },
    {
        eventId: 2,
        name: 'Event 2',
        description: 'Default description for events',
        image: 'https://newinti.edu.my/wp-content/uploads/2017/12/INTI-Logo.jpg',
        registerLink: 'https://www.google.com',
        startDate: '31/12/2021',
        endDate: '31/12/2021',
        status: 'processing',
    },
    {
        eventId: 3,
        name: 'Event 3',
        description: 'Default description for events',
        image: 'https://newinti.edu.my/wp-content/uploads/2017/12/INTI-Logo.jpg',
        registerLink: 'https://www.google.com',
        startDate: '31/12/2021',
        endDate: '31/12/2021',
        status: 'ongoing',
    },
    {
        eventId: 4,
        name: 'Event 4',
        description: 'Default description for events',
        image: 'https://newinti.edu.my/wp-content/uploads/2017/12/INTI-Logo.jpg',
        registerLink: 'https://www.google.com',
        startDate: '31/12/2021',
        endDate: '31/12/2021',
        status: 'ongoing',
    },
    {
        eventId: 5,
        name: 'Event 5',
        description: 'Default description for events',
        image: 'https://newinti.edu.my/wp-content/uploads/2017/12/INTI-Logo.jpg',
        registerLink: 'https://www.google.com',
        startDate: '31/12/2021',
        endDate: '31/12/2021',
        status: 'ongoing',
    },
    {
        eventId: 6,
        name: 'Event 6',
        description: 'Default description for events',
        image: 'https://newinti.edu.my/wp-content/uploads/2017/12/INTI-Logo.jpg',
        registerLink: 'https://www.google.com',
        startDate: '31/12/2021',
        endDate: '31/12/2021',
        status: 'ongoing',
    },
    {
        eventId: 7,
        name: 'Event 7',
        description: 'Default description for events',
        image: 'https://newinti.edu.my/wp-content/uploads/2017/12/INTI-Logo.jpg',
        registerLink: 'https://www.google.com',
        startDate: '31/12/2021',
        endDate: '31/12/2021',
        status: 'ongoing',
    },
    {
        eventId: 8,
        name: 'Event 8',
        description: 'Default description for events',
        image: 'https://newinti.edu.my/wp-content/uploads/2017/12/INTI-Logo.jpg',
        registerLink: 'https://www.google.com',
        startDate: '31/12/2021',
        endDate: '31/12/2021',
        status: 'ongoing',
    },
    {
        eventId: 9,
        name: 'Event 9',
        description: 'Default description for events',
        image: 'https://newinti.edu.my/wp-content/uploads/2017/12/INTI-Logo.jpg',
        registerLink: 'https://www.google.com',
        startDate: '31/12/2021',
        endDate: '31/12/2021',
        status: 'ongoing',
    },
    {
        eventId: 10,
        name: 'Event 10',
        description: 'Default description for events',
        image: 'https://newinti.edu.my/wp-content/uploads/2017/12/INTI-Logo.jpg',
        registerLink: 'https://www.google.com',
        startDate: '31/12/2021',
        endDate: '31/12/2021',
        status: 'ongoing',
    },
];