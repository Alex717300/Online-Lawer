import React from 'react';
import s from './Loader.module.css'

const cubCounter = [
    {id: 1},
    {id: 2},
    {id: 3},
    {id: 4},
    {id: 5},
    {id: 6},
    {id: 7},
    {id: 8},
    {id: 9},
    {id: 10},
    {id: 11},
    {id: 12},
    {id: 13},
    {id: 14},
    {id: 15},
    {id: 16},
];

function Loader() {

    return (
        <div className={s.container}>

            {cubCounter.map((dn) => (
                <div key={dn.id} className={s.block}>
                </div>
            ))}

        </div>
    );
}


export default Loader;