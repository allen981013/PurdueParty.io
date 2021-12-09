import React from "react"
import { connect } from "react-redux"
import { FirebaseReducer, firestoreConnect } from 'react-redux-firebase';
import { compose } from "redux"
import { AppDispatch, RootState } from '../../store';
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, CircularProgress, Grid, styled, Tab, Tabs, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { Link, Redirect } from "react-router-dom";
import { Post } from "../forum/ClassPage";
import { Timestamp } from "firebase/firestore";
import { EventsLandingStatesRedux } from "../events/EventsLandingSlice";
import { fetchSavedEvents, fetchSavedListings, fetchSavedPosts } from "./SavedSlice";

export interface Class {
  title: string;
  href: string;
}

interface listing {
  contactInfo: string,
  description: string,
  id: string,
  image: string,
  owner: string,
  postedDateTime: Timestamp,
  price: number,
  title: string,
  type: string,
}

interface Events {
  title: string,
  startTime: string,
  location: string,
  imageUrl: string,
  href: string,
  hostName: string
}

interface SaveProps {
  auth: FirebaseReducer.AuthState;
  SavedPosts: Post[];
  SavedEvents: Events[];
  SavedListings: listing[];
  fetchSavedPosts: () => void;
  fetchSavedEvents: () => void;
  fetchSavedListings: () => void;
}

interface SaveStates {
  currentTabIndex: number;
}

class SavePage extends React.Component<SaveProps, SaveStates> {

  constructor(props: SaveProps) {
    super(props)
    this.state = {
      currentTabIndex: 0,
    }
  }

  componentDidMount() {
    console.log(this.props.auth.uid)
    if(this.props.auth.uid){
    this.props.fetchSavedPosts();
    this.props.fetchSavedEvents();
    this.props.fetchSavedListings();
    }
  }

  getEventCards(events: Events[]) {
    return events.map((event) =>
      <Grid
        item
        id="image-container"
        xs={12}
        sm={6}
        md={4}
        sx={{ width: "100%" }}
      >
        <Card>
          <CardActionArea component={Link} to={event.href}>
            <CardMedia
              component="img"
              height="140"
              image={event.imageUrl}
            />
            <CardContent sx={{ display: "box", textAlign: "left" }}>
              <Typography gutterBottom noWrap component="div">
                {event.title}
              </Typography>
              <Typography noWrap variant="body2" color="text.secondary" component="div">
                {event.startTime}
              </Typography>
              <Typography noWrap variant="body2" color="text.secondary" component="div">
                {event.location}
              </Typography>
            </CardContent>
            <Box display="block" textAlign="left" padding="4px 8px 4px 16px" sx={{ background: "#F3F4F6" }}>
              <Typography noWrap variant="body2" color="text.secondary" component="div">
                {event.hostName}
              </Typography>
            </Box>
          </CardActionArea>
        </Card>

      </Grid>)
  }

  getListingCard(title: string, price: number, type: string, id: string, imageURL: string) {
    console.log(imageURL);
      return (
        <Grid
          item
          xs={12}
          md={3}
        >
          <Card>
            <CardActionArea component={Link} to={"/sellListing/" + id}>
              <CardMedia
                component="img"
                height="140"
                image={imageURL}
              />
              <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography gutterBottom noWrap component="div">
                  {title}
                </Typography>
                <Typography noWrap variant="body2" color="text.secondary" component="div">
                  {"$" + price + "    -   " + type}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      )
  }

  getPostComponent(post: Post) {
    // Get UI for post cards
    return (
      <Grid
        item
        xs={12}
        md={12}
      >
        <Card sx={{ marginBottom: "16px" }}>
          <CardActionArea disableRipple component={Link} to={post.href}>
            <CardContent sx={{ textAlign: "left" }}>
              <Box display="flex" flexDirection="row" pb="4px">
                {/* Note: We split the following text into separate tags in case we want to 
                  proceed with the idea of making username & time clickable` */}
                <Typography
                  noWrap
                  variant="subtitle2"
                  sx={{ color: "#787c7e", fontSize: "12px", fontWeight: "bold" }}
                >{post.classID}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#787c7e", fontSize: "12px" }}
                >&nbsp;.&nbsp;Posted by&nbsp;
                </Typography>
                <Typography
                  noWrap
                  variant="subtitle2"
                  sx={{ color: "#787c7e", fontSize: "12px" }}
                >{post.poster ? post.poster : "[ deleted ]"}&nbsp;
                </Typography>
                <Typography
                  noWrap
                  variant="subtitle2"
                  sx={{ color: "#787c7e", fontSize: "12px" }}
                >{post.timeSincePosted}
                </Typography>
              </Box>
              <Typography
                noWrap
                variant="h6"
                sx={{ fontSize: "18px", paddingBottom: "4px" }}
              >
                {post.title}
              </Typography>
              <Typography
                noWrap
                variant="body2"
                sx={{ paddingBottom: "0px" }}
              >
                {post.content}
              </Typography>
              <Box pt="8px" position="relative">
                <Button
                  onClick={e => { e.stopPropagation(); e.preventDefault() }}
                  sx={{ textTransform: "none", color: "#787c7e", fontWeight: "bold", fontSize: "12px" }}
                >
                  <ChatBubbleOutlineOutlinedIcon
                    sx={{ color: "#787c7e", marginRight: "4px", fontSize: "20px" }}
                  />
                  {post.numComments} Comments
                </Button>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid >
    )
  }

  getSubPageForPosts(posts?: Post[]) {
    console.log(posts)
    if (posts == null)
      return (
        <Box pt="192px"><CircularProgress /></Box>
      )
    return (
      <Box pt="32px">
        {posts.length == 0
          && <Box pt="192px">No posts have been created yet</Box>}
        {posts.length != 0
          && posts.map((post) => this.getPostComponent(post))}
      </Box>
    )
  }

  getSubPageForEvents(events?: Events[]){
    console.log(events)
    if (events == null)
      return (
        <Box pt="192px"><CircularProgress /></Box>
      )
    return (
      <Box pt="32px">
        {events.length == 0
          && <Box pt="192px">No events have been saved yet</Box>}
        {events.length != 0
          && this.getEventCards(events)}
      </Box>
    )
  }

  getSubPageForListings(listings?: listing[]){
    console.log(listings)
    if (listings == null)
      return (
        <Box pt="192px"><CircularProgress /></Box>
      )
    return (
      <Box pt="32px">
        {listings.length == 0
          && <Box pt="192px">No listings have been saved yet</Box>}
        {listings.length != 0
          && listings.map((listing) => this.getListingCard(listing.title, listing.price, listing.type, listing.id, listing.image))}
      </Box>
    )
  }

  render() {
    console.log(this.props.auth.uid)
    if (!this.props.auth.uid) return <Redirect to='/signin' />
    return (
      <Box width="1200px" p="40px 0px 40px" display="flex" flexDirection="column" alignSelf="center">
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
              <h1 style={{ fontWeight: 300, margin: "0px" }}>Saved</h1>
              <Tabs
                value={this.state.currentTabIndex}
                onChange={(e: any, newIndex: number) => this.setState({ currentTabIndex: newIndex })}
              >
                <Tab label="Sell-Listings" onClick={() => this.props.fetchSavedPosts()}/>
                <Tab label="Events" onClick={() => this.props.fetchSavedEvents()}/>
                <Tab label="Posts" onClick={() => this.props.fetchSavedListings()}/>
              </Tabs>
            </Box>
            {console.log(this.state.currentTabIndex)}
            {console.log(this.props.SavedEvents)}
            {this.state.currentTabIndex == 2 && this.getSubPageForPosts(this.props.SavedPosts)}
            {this.state.currentTabIndex == 1 && this.getSubPageForEvents(this.props.SavedEvents)}
            {this.state.currentTabIndex == 0 && this.getSubPageForListings(this.props.SavedListings)}
          </Grid>
        </Grid>
      </Box>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    auth: state.firebase.auth,
    SavedPosts: state.SavedPage.SavedPosts,
    SavedEvents: state.SavedPage.SavedEvents,
    SavedListings: state.SavedPage.SavedListings,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch, props: SaveProps) => {
  return {
    fetchSavedPosts: () => dispatch(fetchSavedPosts()),
    fetchSavedEvents: () => dispatch(fetchSavedEvents()),
    fetchSavedListings: () => dispatch(fetchSavedListings()),
  }
}

export default compose<React.ComponentType<SaveProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
  ])
)(SavePage)