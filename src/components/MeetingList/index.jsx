import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import './meetingList.css';
import Grid from '@material-ui/core/Grid';
import CardActionArea from '@material-ui/core/CardActionArea';


const MeetingList = ({ meetingList, link }) => {
    return (
        <Grid container>
            {meetingList.map(meeting => (
                <Grid item xs={12} sm={7} key={meeting.meetId}>
                    <Paper style={{ margin: '0.5em' }}>
                        <CardActionArea onClick={link ? ()=> link(meeting.meetId) : ()=>{}}>
                            <ListItem>
                                <ListItemText primary={meeting.name} secondary="Jan 9, 2014" />
                            </ListItem>
                        </CardActionArea>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    )
}

export default MeetingList;