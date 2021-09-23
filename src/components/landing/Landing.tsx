import './Landing.css'
import React, {Component} from 'react'
import { Box, Grid, Button } from '@mui/material'
import { LandingStatesRedux, loadLandingPageContent } from './LandingSlice'
import { AppDispatch, RootState } from '../../store'
import { connect } from 'react-redux'

interface LandingProps {
  events: LandingStatesRedux["events"];
  saleItems: LandingStatesRedux["saleItems"];
  classes: LandingStatesRedux["classes"];
  clubs: LandingStatesRedux["clubs"];
  loadLandingPageContent: () => void;
}

interface LandingStates {
}

// TODO: Integrate real data into section cards
// TODO: Add a section for living 
// TODO: Add a "navigate to" icon button in each section
// TODO: Add a decoration icon in each section

class Landing extends Component<LandingProps, LandingStates> {

  constructor(props: LandingProps) {
    super(props);
    this.props.loadLandingPageContent()
  }

  getItemCard(title: string, href: string, detail?: string) {
    return (
      <div className="item-card">
        <a href={href} title={title + ", " + detail} />
        <div className="item-card__stripe"/>
        <div className="item-card__body">
          <span>{title}</span>
          {detail && <span>{detail}</span>} 
        </div>
      </div>
    )
  }
  
  getSectionCard(title: string, items?: JSX.Element[]) {
    return (
      <Grid item xs={12} sm={6} md={4}>
        <div className="section-card">
          <div className="section-card__stripe"/>
          <div className="section-card__body">
            <div>
              <h3 style={{fontFamily: "Open Sans", fontWeight: "lighter", fontSize: "larger"}}>{title} </h3>
            </div>
            <div className="section-card__body__items">
              {items}
            </div>
          </div>
        </div>
      </Grid>
    )
  }
    
  render() {
    return (
      <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1}}>
          <Box id="cropped-purdue-img"/>
          <Grid container className="sections" spacing={2} sx={{padding: "32px 16px"}}>
            {
              this.getSectionCard("Events", 
              this.props.events.map((event) => this.getItemCard(event.title, event.href, event.time)))
            }
            {
              this.getSectionCard("Marketplace", 
              this.props.saleItems.map((item) => this.getItemCard(item.title, item.href, item.price)))
            }
            {
              this.getSectionCard("Classes", 
              this.props.classes.map((class_) => this.getItemCard(class_.title, class_.href)))
            }
            {
              this.getSectionCard("Clubs", 
              this.props.clubs.map((club) => this.getItemCard(club.title, club.href)))
            }
          </Grid>
      </Box>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    events: state.landing.events,
    saleItems: state.landing.saleItems,
    classes: state.landing.classes,
    clubs: state.landing.clubs,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  // Insert functions from actions folder in similar syntax
  return {
    loadLandingPageContent: () => dispatch(loadLandingPageContent()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing);