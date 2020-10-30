import React, { Component } from "react";
import styled, { css } from "styled-components";
import axios from "axios";
import Cookies from "universal-cookie";
import { withRouter } from "react-router";
import ZodiacWheel from "../assets/Wheel.png";
import AlbumLogo from "../assets/AlbumLogo.png";
import { SpotifyAuth } from "../components";
import Playlist from "./Playlist";
import "./home.css";

const cookies = new Cookies();

const SpinningZodiacWheel = styled.div`
  position: fixed;
  background-image: url(${ZodiacWheel});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;

  transition: opacity 0.5s linear;
  opacity: 0.4;
  width: 100vw;
  z-index: -1;
  animation: spin 60s linear;
  animation-iteration-count: infinite;
  overflow: hidden;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 950px) {
    display: none;
  }
`;

const StyledApp = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;

  flex-direction: row;
  justify-content: space-between;

  @media (max-width: 660px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const FirstContainer = styled.div`
  width: 280px;
  margin-left: 25px;
  margin-top: 25px;

  .logo-placeholder {
    width: 100%;
    height: 180px;
    background-image: url(${AlbumLogo});
    background-size: contain;
    background-repeat: no-repeat;
    transition: width 0.25s ease-out;
  }

  .intro-text {
    font-family: "Libre Caslon Display", serif;
    font-weight: 300;
    font-size: 22px;
  }

  @media (max-width: 375px) {
    margin-bottom: 25px;
    height: 180px;
  }

  ${props =>
    props.authenticated &&
    css`
      @media (min-width: 660px) and (max-width: 1350px) {
        position: absolute;
        display: flex;
        align-items: center;
        margin: auto;
        margin-top: 15px;
        left: 0;
        right: 0;
        width: 225px;
      }

      @media (max-width: 1350px) and (max-height: 770px) {
        display: none;
      }

      @media (max-width: 1350px) and (max-height: 840px) {
        width: 150px;
        margin-top: 20px;
      }

      @media (min-width: 1350px) and (max-width: 1600px) {
        width: 200px;
      }

      @media (min-height: 755px) and (max-width: 660px) {
        display: none !important;
      }
    `}

  ${props =>
    !props.authenticated &&
    css`
      @media (min-width: 660px) and (max-width: 1050px) {
        position: absolute;
        display: flex;
        align-items: center;
        margin: auto;
        margin-top: 15px;

        left: 0;
        right: 0;
        width: 225px;

        .intro-text {
          display: none;
        }
      }

      @media (max-width: 660px) {
        .logo-placeholder {
          margin-top: 20px !important;
        }
      }

      @media (max-height: 845px) and (max-width: 1050px) {
        display: none !important;
      }
    `}

  @media (max-width: 660px) {
    width: 100vw;
    margin-left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 45px;
    justify-content: center;
    padding-bottom: 1rem;

    .logo-placeholder {
      background-position: center;
      width: 100vw;
      height: 140px;
      margin: auto;
    }

    .intro-text {
      display: none;
    }
  }
`;

const SecondContainer = styled.div`
  height: 100vh;
  width: 50vw;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 25%;
  margin: 0 auto;
  transition: left 0.5s ease-out;

  @media (max-width: 660px) {
    align-items: flex-start;
    width: 100vw;
    margin: 0 auto;
    left: 0;
    position: relative;
  }

  ${props =>
    props.authenticated &&
    css`
      @media (max-width: 376px) {
      }
    `}

  ${props =>
    !props.authenticated &&
    css`
      @media (max-width: 950px) {
        margin-top: 1rem;
      }
    `}
`;

const ThirdContainer = styled.div`
  margin-top: 25px;
  margin-right: 25px;
  position: absolute;
  right: 0;
  display: flex;

  ${props =>
    props.authenticated &&
    css`
      @media (max-width: 660px) {
        display: none;
      }

      @media (max-height: 650px) {
        display: none !important;
      }

      @media (max-width: 1200px) and (max-height: 715px) {
        display: none;
      }
    `}

  ${props =>
    !props.authenticated &&
    css`
      @media (max-width: 570px) {
        display: none !important;
      }

      @media (max-width: 800px) and (max-height: 800px) {
        display: none !important;
      }
    `}
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: false,
      loading: true,
      userId: null,
      accessToken: null,
      refreshToken: null,
      user: {},
      playlist: {}
    };
  }

  componentDidMount = async () => {
    let refreshToken = cookies.get("refresh_token");
    let birthMonth = cookies.get("birth_month");

    if (refreshToken === undefined && birthMonth === undefined) {
      if (window.location.search.includes("refresh_token")) {
        let urlParams = window.location.search.split("=");

        refreshToken = urlParams[2].split("&")[0];
        let accessToken = urlParams[1].split("&")[0];
        let userId = urlParams[3];

        cookies.set("refresh_token", refreshToken, { path: "/" });

        const user = await this.getUser(
          accessToken,
          cookies.get("birthMonth"),
          cookies.get("birthDate"),
          cookies.get("birthYear")
        );
        const playlist = await this.getPlaylist(
          cookies.get("birthMonth"),
          cookies.get("birthDate"),
          accessToken
        );

        this.setState({
          authenticated: true,
          loading: false,
          user,
          playlist,
          userId,
          accessToken,
          refreshToken
        });
        this.props.history.push("/");
      } else {
        this.setState({ authenticated: false, loading: false });
      }
    } else {
      let accessToken = await this.getNewAccessToken(refreshToken);
      const user = await this.getUser(
        accessToken,
        cookies.get("birthMonth"),
        cookies.get("birthDate"),
        cookies.get("birthYear")
      );
      let userId = user.id;
      const playlist = await this.getPlaylist(
        cookies.get("birthMonth"),
        cookies.get("birthDate"),
        accessToken
      );

      this.setState({
        authenticated: true,
        loading: false,
        user,
        playlist,
        userId,
        refreshToken,
        accessToken
      });
    }
  };

  getNewAccessToken = async refreshToken => {
    const url = `${this.props.serverUrl}/auth/refresh`;
    let accessToken;

    await axios({
      method: "POST",
      url,
      data: { refresh_token: refreshToken }
    }).then(res => {
      accessToken = res.data.access_token;
    });

    return accessToken;
  };

  getUser = async (accessToken, month, day, year) => {
    const url = `${this.props.serverUrl}/user`;
    const birth = {
      month,
      day,
      year
    };

    let user;

    await axios({
      method: "GET",
      url,
      params: { access_token: accessToken, birth: birth }
    })
      .then(res => {
        user = res.data;
      })
      .catch(err => {
        console.log(err);
      });
    return user;
  };

  getPlaylist = async (month, day, accessToken) => {
    const url = `${this.props.serverUrl}/playlist/sign`;
    let playlist;

    await axios({
      method: "GET",
      url,
      params: { month, day, access_token: accessToken }
    })
      .then(res => {
        playlist = res.data;
      })
      .catch(err => {
        console.log(err);
      });

    return playlist;
  };

  render() {
    const {
      loading,
      authenticated,
      accessToken,
      playlist,
      userId
    } = this.state;

    if (!loading) {
      return (
        <StyledApp>
          <div className="bg-image">
            <img src={require("../assets/WheelBG.jpg")} />
          </div>
          <SpinningZodiacWheel />
          <FirstContainer authenticated={authenticated}>
            <div className="logo-placeholder" />
            {!authenticated ? (
              <p className="intro-text">
                Hi this is T.I. <br />
                My new album L.I.B.R.A is <br />
                available now. <br />
                Find out your fortune and <br />
                bless up.
              </p>
            ) : null}
          </FirstContainer>
          <SecondContainer authenticated={authenticated}>
            {authenticated ? (
              <Playlist
                accessToken={accessToken}
                playlist={playlist}
                serverUrl={this.props.serverUrl}
                userId={userId}
              />
            ) : (
              <SpotifyAuth serverUrl={this.props.serverUrl} />
            )}
          </SecondContainer>
          <ThirdContainer authenticated={authenticated}>
            {/*!authenticated ? (
              <a href="" className={"btn stream-button"}>
                Share
              </a>
            ) : null*/}

            <a
              className={"btn stream-button"}
              target="_blank"
              rel="noopener noreferrer"
              href={`https://music.empi.re/thelibra`}
            >
              Stream
            </a>
          </ThirdContainer>
        </StyledApp>
      );
    } else {
      return <LoadingContainer />;
    }
  }
}
export default withRouter(App);
