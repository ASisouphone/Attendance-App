import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import './OrgList.css';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    card: {
        maxWidth: 200,
    },
    media: {
        objectFit: 'cover',
    }
};

const OrgList = ({ orgList, classes }) => {
    return (
        <div className="grid">
            {orgList.map(org => (
                <Card key={org.orgId}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            alt="Cat"
                            className={classes.media}
                            image="https://placekitten.com/200/100"
                            title="Cat"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                {org.orgName}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button size="small" color="primary">
                            Share
        </Button>
                        <Button size="small" color="primary">
                            Learn More
        </Button>
                    </CardActions>
                </Card>
            ))}
        </div>
    )
}

export default withStyles(styles)(OrgList);