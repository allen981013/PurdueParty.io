import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { RootState, AppDispatch } from '../../store';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  Box, Button, CircularProgress, Grid, Card, CardActionArea,
  CardMedia, CardContent, Typography
} from '@mui/material'
import { produceWithPatches } from 'immer';

interface PostsLandingState {

}

interface PostsLandingProps {
  auth: any,
  match: any,
  post: {
    id: string,
    title: string,
    content: string,
    owner: string,
    classID: string
  }[],
  classes: {
    courseID: string,
    department: string,
    description: string,
    instructorName: string,
    profEmail: string,
    title: string
  }[]
}

const boldText = {
  fontWeight: 'bold' as 'bold'
}

class PostsLanding extends Component<PostsLandingProps, PostsLandingState> {
  // Initialize state
  constructor(props: PostsLandingProps) {
    super(props);
    this.state = {
    };
  }

  getPost(id: string, title: string, content: string, owner: string, classID: string) {
    return (
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
              {classID}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    )
  }

  getClass(department: string, description: string, instructorName: string, profEmail: string, title: string) {
    return (
      <Grid
        item
        id="image-container"
        xs={12}
        md={3}
      >
        <Card>
          <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <label htmlFor="title">Course:</label>
            <Typography noWrap variant="body2" component="div" marginBottom="10px">
              {title}
            </Typography>
            <label htmlFor="title">Department:</label>
            <Typography noWrap variant="body2" component="div" marginBottom="10px">
              {department}
            </Typography>
            <label htmlFor="title">Description:</label>
            <Typography noWrap variant="body2" component="div" marginBottom="10px">
              {description}
            </Typography>
            <label htmlFor="title">Instructor:</label>
            <Typography noWrap variant="body2" component="div" marginBottom="10px">
              {instructorName}
            </Typography>
            <label htmlFor="title">Class:</label>
            <Typography noWrap variant="body2" component="div" marginBottom="10px">
              {profEmail}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    )
  }

  isInClass = (post: any) => {
    if (this.props.post) {
      return post.classID === this.props.match.params.classID;
    }
    else {
      return false;
    }
  }

  isThisClass = (classes: any) => {
    if (this.props.classes) {
      return classes.courseID === this.props.match.params.classID;
    }
    else {
      return false;
    }
  }


  render() {
    const { auth } = this.props;
    if (!this.props.auth.uid) return <Redirect to='/signin' />

    return (
      <div>
        {console.log(this.props.post)}
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          pb="16px"
        >
          <h1 style={{ fontWeight: 300, marginLeft: "20%", marginTop: "3%" }}>{this.props.match.params.classID}</h1>
          <Button
            component={Link}
            to={"/create-post/" + this.props.match.params.classID}
            variant="outlined"
            sx={{ color: "black", border: "1px solid black", marginRight: "20%", marginTop: "2%" }}
          > Create New Post
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
          <Grid container className="sections" spacing={2} sx={{ padding: "32px 16px" }}>
            {(this.props.post != undefined && this.props.post.length != 0)
              ?
              this.props.post.filter(this.isInClass).map((post) => this.getPost(post.id, post.title, post.content, post.owner, post.classID))
              :
              <div>No Post Here</div>
            }
          </Grid>

          {(this.props.classes != undefined)
            ?
            this.props.classes.filter(this.isThisClass).map((classes) => this.getClass(classes.department, classes.description, classes.instructorName, classes.profEmail, classes.title))
            :
            <div>No Class Here</div>
          }
        </Box>

      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    post: state.firestore.ordered.posts,
    classes: state.firestore.ordered.classes,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
  }
}

export default compose<React.ComponentType<PostsLandingProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((props: PostsLandingProps) => {
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