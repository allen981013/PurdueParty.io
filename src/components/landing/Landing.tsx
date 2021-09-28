import './Landing.css'
import { Component } from 'react'
import { Box, Grid } from '@mui/material'
import { LandingStatesRedux, loadLandingPageContent } from './LandingSlice'
import { AppDispatch, RootState } from '../../store'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, IconButton } from '@mui/material'
import { ArrowForwardOutlined } from "@mui/icons-material"

interface LandingProps {
  events: LandingStatesRedux["events"];
  saleItems: LandingStatesRedux["saleItems"];
  classes: LandingStatesRedux["classes"];
  clubs: LandingStatesRedux["clubs"];
  loadLandingPageContent: () => void;
}

interface LandingStates {
}

// TODO: Add a decoration icon in each section

class Landing extends Component<LandingProps, LandingStates> {

  livingPageItems = [
    { title: "Gym", href: "living/gym" },
    { title: "Laundry", href: "living/laundry" },
    { title: "Bus", href: "living/bus" },
    { title: "Dining", href: "living/dining" },
  ]

  constructor(props: LandingProps) {
    super(props);
    this.props.loadLandingPageContent()
  }

  getItemCard(title: string, href: string, detail?: string) {
    return (
      <Button
        component={Link}
        to={href}
        title={detail ? title + ", " + detail : title}
        className="item-card"
      >
        <div className="item-card__stripe" />
        <div className="item-card__body">
          <span>{title}</span>
          {detail && <span>{detail}</span>}
        </div>
      </Button>
    )
  }

  getSectionCard(title: string, href: string, items?: JSX.Element[]) {
    return (
      <Grid item xs={12} sm={6} md={4}>
        <div className="section-card">
          <div className="section-card__stripe" />
          <div className="section-card__body">
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", }}>
              <h3 style={{ fontFamily: "Open Sans", fontWeight: "lighter", fontSize: "larger" }}>{title} </h3>
              <IconButton
                component={Link}
                to={href}
                edge={"end"}
                disableFocusRipple={true}
                disableRipple={true}
                size={"small"}
                sx={{ marginLeft: "4px", color: "black" }}
              >
                <ArrowForwardOutlined sx={{ fontSize: 20 }} />
              </IconButton>
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
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
        <Box id="cropped-purdue-img" />
        <Grid container className="sections" spacing={2} sx={{ padding: "32px 16px" }}>
          {
            this.getSectionCard("Events", "events",
              this.props.events.map((event) => this.getItemCard(event.title, event.href, event.time)))
          }
          {
            this.getSectionCard("Marketplace", "marketplace",
              this.props.saleItems.map((item) => this.getItemCard(item.title, item.href, item.price)))
          }
          {
            this.getSectionCard("Classes", "classes",
              this.props.classes.map((class_) => this.getItemCard(class_.title, class_.href)))
          }
          {
            this.getSectionCard("Clubs", "clubs",
              this.props.clubs.map((club) => this.getItemCard(club.title, club.href)))
          }
          {
            this.getSectionCard("Living", "living",
              this.livingPageItems.map((item) => this.getItemCard(item.title, item.href)))
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