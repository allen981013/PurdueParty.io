import React, { Component } from 'react';
import { Dispatch, Action, compose } from 'redux';
import { addPost } from '../../store/actions/postActions'
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Timestamp } from '@firebase/firestore';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  Box, Button, CircularProgress, Grid, Card, CardActionArea,
  CardMedia, CardContent, Typography
} from '@mui/material'

// Interface/type for Classes State
interface ClassesState {
  
}

// Interface/type for Clubs Props
interface ClassesProps {
    class: {
        title: string,
        id: string
    }[],
    auth: any,
    firebase: any
}

class Classes extends Component<ClassesProps, ClassesState> {
  // Initialize state
  constructor(props: ClassesProps) {
    super(props);
    this.state = {
    }
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
                <CardActionArea component={Link} to={"/classes/" + id}>
                    <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <label htmlFor="title">{id}</label>
                    <Typography noWrap variant="body2" color="text.secondary" component="div" marginBottom="10px">
                        {title}
                    </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            </Grid>
        )
}

  render() {
    const { auth } = this.props;
    if (!this.props.auth.uid) return <Redirect to='/signin' />

    if (!auth.uid) return <Redirect to='/signin'/>

    return (
      <div>
            <Box
              display="flex"
              justifyContent="space-between"
              width="100%"
              pb="16px"
            >
              <h1 style={{ fontWeight: 300, marginLeft: "20%", marginTop:"3%" }}>Classes</h1>
            </Box>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
                    <Box id="cropped-purdue-img" />
                    <Grid container className="sections" spacing={2} sx={{ padding: "32px 16px" }}>
                    {this.props.class != undefined && this.props.class.length != 0 
                    ?
                    this.props.class.map((classes) => this.getClass(classes.title, classes.id))
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
  // Insert functions from actions folder in similar syntax
  return {
  }
}

export default compose<React.ComponentType<ClassesProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'classes' }
  ])
)(Classes)