import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import './OrgList.css';
import { withFirebase } from '../Firebase';

class OrgList extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        const { orgList } = this.props;


        return (
            <div className="grid">
                {orgList.map(org => (
                    <Card key={org.orgId}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                alt="Cat"
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
                            {this.props.add &&
                                <Button size="small" color="primary" onClick={() => this.props.add(org)}>
                                    Add
                             </Button>
                            }
                            {this.props.remove &&
                                <Button size="small" color="primary" onClick={() => this.props.remove(org.orgId)}>
                                    Delete
                             </Button>
                            }
                        </CardActions>
                    </Card>
                ))}
            </div>
        )
    }
}

export default withFirebase(OrgList);