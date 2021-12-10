import './Landing.css'
import { Component } from 'react'
import { Box, Button, Grid } from '@mui/material'
import { LandingStatesRedux, loadLandingPageContent } from './LandingSlice'
import { AppDispatch, RootState } from '../../store'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { IconButton } from '@mui/material'
import { ArrowForwardOutlined } from "@mui/icons-material"
import { toast } from 'react-toastify'
import { PageVisitInfo, updatePageVisitInfo } from '../tutorial/TutorialSlice'
import { HOMEPAGE_TUTORIAL_1, HOMEPAGE_TUTORIAL_2, HOMEPAGE_TUTORIAL_3 } from '../tutorial/Constants'

interface LandingProps {
  events: LandingStatesRedux["events"];
  saleItems: LandingStatesRedux["saleItems"];
  classes: LandingStatesRedux["classes"];
  clubs: LandingStatesRedux["clubs"];
  pageVisitInfo: PageVisitInfo;
  updatePageVisitInfo: (newPageVisitInfo: PageVisitInfo) => void;
  loadLandingPageContent: () => void;
  auth: any
}

interface LandingStates {
}

// TODO: Add a decoration icon in each section

class Landing extends Component<LandingProps, LandingStates> {

  isTutorialRendered = false
  livingPageItems = [
    { title: "Gym", href: "/gym" },
    { title: "Laundry", href: "/laundry" },
    { title: "Bus", href: "/transportation" },
    { title: "Dining", href: "/dining" },
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
        sx={{ fontWeight: "light", textTransform: "unset", background: "white", color: "black" }}
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
        <div className="section-card" style={{ background: "white" }}>
          <div className="section-card__stripe" />
          <div className="section-card__body">
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <h3 style={{ fontFamily: "Open Sans", fontWeight: "lighter", fontSize: "larger", color: "black" }}>{title} </h3>
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
    if (this.props.pageVisitInfo
      && !this.props.pageVisitInfo.homePage
      && !this.isTutorialRendered
    ) {
      toast.info(HOMEPAGE_TUTORIAL_1)
      toast.info(HOMEPAGE_TUTORIAL_2)
      toast.info(HOMEPAGE_TUTORIAL_3)
      let newPageVisitInfo: PageVisitInfo = {
        ...this.props.pageVisitInfo,
        homePage: true,
      }
      this.props.updatePageVisitInfo(newPageVisitInfo)
      this.isTutorialRendered = true
    }
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1, width: "100%", marginTop: "-5px" }}>
        <Box id="cropped-purdue-img" sx={{ height: { xs: "250px", sm: "400px" } }} />
        <Grid container className="sections" spacing={2} sx={{ padding: "32px 24px" }}>
          {
            this.getSectionCard("Events", "/events",
              this.props.events.map((event) => this.getItemCard(event.title, event.href, event.time)))
          }
          {
            this.getSectionCard("Marketplace", "/marketplace",
              this.props.saleItems.map((item) => this.getItemCard(item.title, item.href, item.price)))
          }
          {
            this.getSectionCard("Forum", "/forum",
              this.props.classes.map((class_) => this.getItemCard(class_.title, class_.href)))
          }
          {
            this.getSectionCard("Clubs", "/clubs",
              this.props.clubs.map((club) => this.getItemCard(club.title, club.href)))
          }
          {
            this.getSectionCard("Living", "/living",
              this.livingPageItems.map((item) => this.getItemCard(item.title, item.href)))
          }
        </Grid>
      </Box>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    pageVisitInfo: state.tutorial.pageVisitInfo,
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
    updatePageVisitInfo: (newPageVisitInfo: PageVisitInfo) => dispatch(updatePageVisitInfo(newPageVisitInfo)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
