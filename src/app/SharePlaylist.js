import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import { withRouter } from "react-router";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import ReactPlayer from "react-player";
import { FaPlay } from "react-icons/fa";
import Video from "../assets/video/Lebron.mp4";
import AlbumLogo from "../assets/AlbumLogo.png";
import Signs from "./Signs";

const StyledApp = styled.div`
  display: flex;
  width: 100vw;
  min-height: 100vh;
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: 415px) {
    flex-direction: column;
    overflow: scroll;
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

  @media (min-width: 415px) and (max-width: 720px) {
    position: absolute;
    display: flex;
    align-items: center;
    margin: auto;
    margin-top: 15px;
    left: 0;
    right: 0;
    width: 175px;
  }

  @media (max-width: 415px) {
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
  }
`;

const SecondContainer = styled.div`
  height: 100vh;
  width: 50vw;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  left: 25%;
  margin: 0 auto;
  transition: left 0.5s ease-out;

  .intro-text {
    font-family: "Merriweather", serif;
    text-align: center;
    width: 300px;
    font-size: 18px;
  }

  .zodiac-sign {
    font-family: "Merriweather", serif;
    text-align: center;
    width: 300px;
    font-size: 18px;
    font-weight: 700;
    text-transform: capitalize;
  }

  @media (max-width: 415px) {
    align-items: center;
    width: 300px;
    margin: 0 auto;
    left: 0;
    position: relative;
    justify-content: center;
  }

  @media (min-width: 415px) and (max-width: 720px) {
    width: 250px;
    left: 0;
    right: 0;

    .intro-text {
      display: none;
    }
  }

  @media (min-width: 729px) and (max-width: 1100px) {
    position: absolute;
    left: 50%;
  }
`;

const HoroscopeVideoContainer = styled.div`
  width: 300px;
  height: 531px;
  background-color: #f8e3b3;
  overflow: hidden;
  border-radius: 10px;
  border: 2px solid #d2a038;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const PlayButtonContainer = styled.div`
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SocialMediaIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 8px;
  transition: ease-out 0.3s;

  :hover {
    background-color: #d2a038;
  }

  .icon-text {
    color: white;
    font-family: "Merriweather", serif;
    margin: 0 auto;
  }
`;

const SocialMediaContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .share-text {
    font-family: "Merriweather", serif;
    font-size: 18px;
    margin: 0 10px 0 0;
  }

  @media (min-width: 415px) and (max-width: 675px) {
    justify-content: center;

    .share-text {
      display: none;
    }
  }

  @media (max-width: 1300px) {
    margin-bottom: 10px;
  }
`;

const ThirdContainer = styled.div`
  margin-top: 25px;
  margin-right: 25px;
  position: absolute;
  right: 0;

  @media (max-width: 415px) {
    display: none;
  }

  @media (min-width: 415px) and (max-width: 720px) {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 20px;
    margin-left: auto;
    margin-right: auto;
    width: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stream-override-button {
    margin: 0 !important;
  }

  @media (min-width: 720px) and (max-width: 1100px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100px;
    position: absolute;
    bottom: 30px;
    left: 20px;
    width: 200px;
  }
`;

class SharePlaylist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      videoIsPlaying: false,
      playlist: {}
    };
  }

  componentWillMount = async () => {
    const sign =
      Signs[
        window.location.href
          .split("/")
          .pop()
          .toLowerCase()
      ];

    if (sign === undefined) {
      this.props.history.push("/");
    } else {
      const refreshToken = `AQDYZkegeK9Vx8FAX_DXimDBn91KpzY8o4udA9QVVyJK5yq_UpqoeI2lWZ1JhKL-9Tq65RW_lcRhEV1UEWnIDS6_G-rIv8f8Ga6iCVN6R7T0jh2J47-MZY8xDKeALLZXsqA`;
      const accessToken = await this.getNewAccessToken(refreshToken);

      const playlist = await this.getPlaylist(
        sign.month,
        sign.day,
        accessToken
      );
      this.setState({ videoIsPlaying: true });
      this.setState({ playlist: playlist, loading: false });
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
    const { playlist, loading, videoIsPlaying } = this.state;

    if (!loading) {
      return (
        <StyledApp>
          <FirstContainer>
            <div className="logo-placeholder" />
          </FirstContainer>
          <SecondContainer>
            <p className="intro-text">{`Your playlist has been saved. Why not share your ${playlist.sign} playlist with your friends.`}</p>
            <HoroscopeVideoContainer>
              <ReactPlayer
                className="react-player"
                url={Video}
                playing={videoIsPlaying}
                width="100%"
                height="100%"
                controls={false}
              />

              {!videoIsPlaying ? (
                <PlayButtonContainer>
                  <FaPlay
                    style={{ cursor: "pointer" }}
                    size={48}
                    onClick={() => {
                      this.setState({ videoIsPlaying: true });
                    }}
                  />
                </PlayButtonContainer>
              ) : null}
            </HoroscopeVideoContainer>
            <p className="zodiac-sign">{playlist.sign}</p>
            <SocialMediaContainer>
              <p className="share-text">Share Playlist</p>
              <div>
                <FacebookShareButton
                  url={`https://www.starsignsbyti.com/playlist/${playlist.sign}`}
                  quote={"Stream The Libra Now"}
                  hashtag="#TheLibra"
                  className="social-media-btn"
                >
                  <SocialMediaIcon>
                    <p className="icon-text">F</p>
                  </SocialMediaIcon>
                </FacebookShareButton>
                <TwitterShareButton
                  url={`https://www.starsignsbyti.com/playlist/${playlist.sign}`}
                  title={`Get your personalized horoscope from T.I.`}
                  hashtag={["#TheLibra"]}
                  related={["tip"]}
                  className="social-media-btn"
                >
                  <SocialMediaIcon>
                    <p className="icon-text">T</p>
                  </SocialMediaIcon>
                </TwitterShareButton>
              </div>
            </SocialMediaContainer>
          </SecondContainer>

          <ThirdContainer>
            <a
              className={"btn stream-button stream-override-button"}
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
      return <div />;
    }
  }
}

export default withRouter(SharePlaylist);
