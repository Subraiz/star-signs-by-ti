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
  height: 106vh;
  top: -3vh;
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

  @media (max-width: 500px) {
    display: none;
  }
`;

const StyledApp = styled.div`
  display: flex;
  width: 100vw;
  min-height: 100vh;
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: 500px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const FirstContainer = styled.div`
  width: 350px;
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
    font-family: "Merriweather", serif;
    font-weight: 300;
    font-size: 22px;
  }

  ${props =>
    props.authenticated &&
    css`
      @media (min-width: 501px) and (max-width: 1300px) {
        position: absolute;
        display: flex;
        align-items: center;
        margin: auto;
        margin-top: 15px;
        left: 0;
        right: 0;
        width: 225px;
      }

      @media (min-width: 1300px) and (max-width: 1550px) {
        width: 250px;
      }
    `}

  ${props =>
    !props.authenticated &&
    css`
      @media (min-width: 501px) and (max-width: 720px) {
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
    `}

  @media (max-width: 500px) {
    width: 100vw;
    margin-left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 15px;

    .logo-placeholder {
      width: 50vw;
      margin: auto;
      max-height: 100px;
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

  @media (max-width: 500px) {
    align-items: flex-start;
    width: 100vw;
    margin: 0 auto;
    left: 0;
    position: relative;
  }

  ${props =>
    !props.authenticated &&
    css`
      @media (min-width: 501px) and (max-width: 720px) {
        width: 250px;
        left: 0;
        right: 0;
      }

      @media (min-width: 729px) and (max-width: 1100px) {
        position: absolute;
        left: 50%;
      }
    `}
`;

const ThirdContainer = styled.div`
  margin-top: 25px;
  margin-right: 25px;
  position: absolute;
  right: 0;
  display: flex;

  @media (max-width: 500px) {
    display: none;
  }

  ${props =>
    !props.authenticated &&
    css`
      @media (min-width: 501px) and (max-width: 720px) {
        display: none;
      }

      @media (min-width: 720px) and (max-width: 1100px) {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100px;
        position: absolute;
        bottom: 30px;
        left: 0;
        width: 240px;
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

        const user = await this.getUser(accessToken);
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
      const user = await this.getUser(accessToken);
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

  getUser = async accessToken => {
    const url = `${this.props.serverUrl}/user`;
    let user;

    await axios({
      method: "GET",
      url,
      params: { access_token: accessToken }
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
              href={`https://open.spotify.com/playlist/${playlist.playlist_id}`}
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
