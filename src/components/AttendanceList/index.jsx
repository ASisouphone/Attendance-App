import React, { Component } from 'react';
import { Button, Paper, CardActionArea, ListItemText, ListItem } from '@material-ui/core';

const AttendanceList = ({ memberList, mark, unmark }) => {
    return (
        <div>
            {memberList.map(member => (
                <Paper key={member.memId} style={{ marginBottom: '1em' }}>
                        <ListItem>
                            <ListItemText primary={member.name} secondary={member.email} />
                            {mark &&
                                <Button variant="contained" color="primary" onClick={() => mark(member)}>Mark</Button>
                            }
                            {unmark &&
                                <Button variant="outlined" color="primary" onClick={() => unmark(member)}>UnMark</Button>
                            }
                        </ListItem>
                </Paper>
            ))}
        </div>
    )

}

export default AttendanceList;