import React, { Component } from 'react';

const AttendanceList = ({ memberList, mark, unmark }) => {
    return (
        <div>
            {memberList.map(member => (<ul key={member.memId}>
                <li>{member.name}</li>
                <li>{member.email}</li>
                <li>
                    {mark &&
                        <button onClick={()=>mark(member)}>Mark</button>
                    }
                    {unmark &&
                        <button onClick={()=>unmark(member)}>UnMark</button>
                    }
                </li>
            </ul>))}
        </div>
    )

}

export default AttendanceList;