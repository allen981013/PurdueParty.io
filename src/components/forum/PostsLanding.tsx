import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import {RootState, AppDispatch} from '../../store';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
    Box, Button, CircularProgress, Grid, Card, CardActionArea,
    CardMedia, CardContent, Typography
  } from '@mui/material'

interface PostsLandingState{

}

interface PostsLandingProps{
    auth: any,
    match: any,
    class:{
        id: string;
        title: string
    }
}

const boldText = {
    fontWeight: 'bold' as 'bold'
  }

class PostLanding extends Component<PostsLandingProps, PostsLandingState> {
    // Initialize state
    constructor(props:PostsLandingProps) {
        super(props);
        this.state = {
        };
      }

      getClass(title: string, id: string){
        
        return(
            <Grid
            item
            id="image-container"
            xs={12}
            md={3}
            >
            <Card>
                    <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <Typography noWrap variant="body2" color="text.secondary" component="div" marginBottom="10px">
                        {id + title}
                    </Typography>
                    </CardContent>
            </Card>
            </Grid>
        )
}

      render(){
        const { auth } = this.props;
        if (!this.props.auth.uid) return <Redirect to='/signin' />
        
        return (
            <div>
            <Box
              display="flex"
              justifyContent="space-between"
              width="100%"
              pb="16px"
            >
              <h1 style={{ fontWeight: 300, marginLeft: "20%", marginTop:"3%" }}>{this.props.class.title}</h1>
              <Button
                component={Link}
                to=""
                variant="outlined"
                sx={{ color: "black", border: "1px solid black", marginRight: "20%", marginTop: "2%"}}
              > Create New Post
              </Button>
            </Box>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
                    <Box id="cropped-purdue-img" />
                    <Grid container className="sections" spacing={2} sx={{ padding: "32px 16px" }}>
                    {this.props.class != undefined 
                    ?
                    this.props.class.title
                    :
                    <div>Classes Missing</div>
                    }
                    </Grid>
            </Box>
      </div>
    )
      }
}

const mapStateToProps = (state: RootState) => {
    return {
        class: state.firestore.ordered.classes,
        auth: state.firebase.auth
    }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
    // Return functions for signIn
    return {
    }
  }

export default compose<React.ComponentType<PostsLandingProps>>(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((props:PostsLandingProps) => {
      if (typeof props.match.params != "undefined") {
        return [
          { 
            collection: 'classes',
            doc: props.match.params.classID
          },
          {
            collection: 'post'
          }
        ]
      } else {
        return []
      }
    })
  )(PostLanding)