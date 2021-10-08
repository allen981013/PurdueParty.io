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
import { produceWithPatches } from 'immer';

interface PostsLandingState{

}

interface PostsLandingProps{
    auth: any,
    match: any,
    post:{
        id: string,
        title: string,
        content: string,
        owner: string,
        classFrom: string
    }[]
}

const boldText = {
    fontWeight: 'bold' as 'bold'
  }

class PostsLanding extends Component<PostsLandingProps, PostsLandingState> {
    // Initialize state
    constructor(props:PostsLandingProps) {
        super(props);
        this.state = {
        };
      }

    getPost(id: string, title: string, content: string, owner: string, classFrom: string){
        return(
            <Grid
            item
            id="image-container"
            xs={12}
            md={3}
            >
            <Card>
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <label htmlFor="title">Post ID:</label>
                <Typography noWrap variant="body2" component="div" marginBottom="10px">
                    {id}
                </Typography>
                <label htmlFor="title">Title:</label>
                <Typography noWrap variant="body2" component="div" marginBottom="10px">
                    {title}
                </Typography>
                <label htmlFor="title">Content:</label>
                <Typography noWrap variant="body2" component="div" marginBottom="10px">
                    {content}
                </Typography>
                <label htmlFor="title">Post by:</label>
                <Typography noWrap variant="body2" component="div" marginBottom="10px">
                    {owner}
                </Typography>
                <label htmlFor="title">Class:</label>
                <Typography noWrap variant="body2" component="div" marginBottom="10px">
                    {classFrom}
                </Typography>
                </CardContent>
            </Card>
            </Grid>
        )
    }
    checkInClass(classFrom: string){
        return classFrom == this.props.match.params.classID;
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
              <h1 style={{ fontWeight: 300, marginLeft: "20%", marginTop:"3%" }}>{this.props.match.params.classID}</h1>
              <Button
                component={Link}
                to={ "/create-post/" + this.props.match.params.classID}
                variant="outlined"
                sx={{ color: "black", border: "1px solid black", marginRight: "20%", marginTop: "2%"}}
              > Create New Post
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1}}>
                    <Box id="cropped-purdue-img" />
                    <Grid container className="sections" spacing={2} sx={{ padding: "32px 16px" }}>
                    {this.props.post != undefined && this.props.post.length != 0 && this.props.post.map((post) => this.checkInClass(post.classFrom))
                    ?
                    this.props.post.map((post) => this.getPost(post.id, post.title, post.content, post.owner, post.classFrom))
                    :
                    <div>No Post Here</div>
                    }
                    </Grid>
            </Box>
      </div>
    )
      }
}

const mapStateToProps = (state: RootState) => {
    return {
        post: state.firestore.ordered.posts,
        auth: state.firebase.auth,
    }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
    }
  }

  export default compose<React.ComponentType<PostsLandingProps>>(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((props:PostsLandingProps) => {
        if (typeof props.match.params != "undefined") {
          return [
            { 
              collection: 'posts',
            }
          ]
        } else {
          return []
        }
      })
    )(PostsLanding)