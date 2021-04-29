const BASE_STATE =  [
    {
        id: 'board-1',
        type: 1,
        className:'board',
        boardName: 'Players',
        color: 'grey',
        cards: [
            { id:"1", className:"card", draggable:"true", type: 1, title: 'Kusal Medis'},
            { id:"2", className:"card", draggable:"true", type: 1, title: 'Kusal Medis'},
        ] },
    {
        id: 'board-2',
        type: 2,
        className:'board',
        boardName: 'Selected Players',
        color: 'green',
        cards: [
        ]
    }
];

export default BASE_STATE;
 