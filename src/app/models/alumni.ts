export interface Alumni {
    name: string,
    alumniId: number,
    identificationCard: string,
    studentId: string,
    personalEmail: string,
    studentHandphone: string,
    studentTelephoneNumber: string,
    graduatingCampus: string,
    yearOfGraduation: string,
    graduatingProgramme: string,
    graduatedProgrammeName: string,
    levelOfStudy: string,
}

export const NULL_MEMBER: Alumni = {
    name: '',
    alumniId: 0,
    identificationCard: '',
    studentId: '',
    personalEmail: '',
    studentHandphone: '',
    studentTelephoneNumber: '',
    graduatingCampus: '',
    yearOfGraduation: '',
    graduatingProgramme: '',
    graduatedProgrammeName: '',
    levelOfStudy: '',
};

export const MOCK_MEMBERS: Alumni[] = [
    {
        name: 'Lee Yew Tong',
        alumniId: 1,
        identificationCard: '990909-09-9090',
        studentId: 'J123456789',
        personalEmail: 'Lyt1123@gmail.com',
        studentHandphone: '016-3426671',
        studentTelephoneNumber: '',
        graduatingCampus: 'IICS',
        yearOfGraduation: '2019',
        graduatingProgramme: 'DB',
        graduatedProgrammeName: 'Diploma in Business',
        levelOfStudy: 'Diploma',
    },
    {
        name: 'Ali Abdul',
        alumniId: 2,
        identificationCard: '880808-08-8008',
        studentId: 'J123456790',
        personalEmail: 'Ali188@hotmail.com',
        studentHandphone: '018-2174514',
        studentTelephoneNumber: '',
        graduatingCampus: 'IU',
        yearOfGraduation: '2018',
        graduatingProgramme: 'DIT',
        graduatedProgrammeName: 'Diploma in Information Technology',
        levelOfStudy: 'Diploma',
    },
    {
        name: 'Ashley Yap',
        alumniId: 3,
        identificationCard: '970709-07-7907',
        studentId: 'J123456791',
        personalEmail: 'ash_yap7@live.com',
        studentHandphone: '012-9022445',
        studentTelephoneNumber: '',
        graduatingCampus: 'IICS',
        yearOfGraduation: '2017',
        graduatingProgramme: 'DB',
        graduatedProgrammeName: 'Diploma in Business',
        levelOfStudy: 'Diploma',
    },
];
