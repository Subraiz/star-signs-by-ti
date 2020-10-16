import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import { withRouter } from "react-router";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { FaTwitter, FaFacebook, FaPlay } from "react-icons/fa";
import { TiSocialInstagramCircular } from "react-icons/ti";
import ZodiacWheel from "../assets/Wheel.png";
import ReactPlayer from "react-player";
import VideoRecordings from "./VideoRecordings";
import AlbumLogo from "../assets/AlbumLogo.png";
import Signs from "./Signs";

const StyledApp = styled.div`
  display: flex;
  width: 100vw;
  min-height: 100vh;
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: 550px) {
    flex-direction: column;
    overflow: scroll;
    justify-content: flex-start;
  }
`;

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

  @media (min-width: 550px) and (max-width: 920px) {
    position: absolute;
    display: flex;
    align-items: center;
    margin: auto;
    margin-top: 15px;
    left: 0;
    right: 0;
    width: 175px;
  }

  @media (max-width: 550px) {
    width: 100vw;
    margin-left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 15px;

    .logo-placeholder {
      margin: auto;
      width: 60vw;
      height: 120px;
      margin-top: 45px;
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
    font-family: "Libre Caslon Text", serif;
    text-align: center;
    width: 500px;
    font-size: 18px;
  }

  .zodiac-sign {
    font-family: "Libre Caslon Text", serif;
    text-align: center;
    width: 300px;
    font-size: 24px;
    font-weight: 700;
    text-transform: capitalize;
  }

  @media (max-width: 550px) {
    align-items: center;
    width: 90vw;
    margin: 0 auto;
    margin-top: -110px;
    left: 0;
    position: relative;
    justify-content: center;

    .intro-text {
      width: 90vw;
    }
  }

  @media (min-width: 550px) and (max-width: 920px) {
    width: 250px;
    left: 0;
    right: 0;

    .intro-text {
      width: 500px;
    }
  }

  @media (min-width: 920px) and (max-width: 1260px) {
    position: absolute;
    right: 50px;
    left: auto;
  }
`;

const HoroscopeVideoContainer = styled.div`
  width: 500px;
  height: 500px;
  background-color: #f8e3b3;
  overflow: hidden;
  border-radius: 10px;
  border: 2px solid #d2a038;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2);
  position: relative;

  .play-video-button {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 4;

    .play-icon {
      color: white;
      font-size: 42px;
      cursor: pointer;
    }
  }

  @media (max-width: 550px) {
    height: 90vw;
    width: 90vw;
  }
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
  color: #f8e3b3;

  :hover {
    background-color: #f8e3b3;
    color: black;
  }

  a {
    color: #f8e3b3;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    :hover {
      color: black;
    }
  }

  .icon-text {
    margin: 0 auto;
  }
`;

const SocialMediaContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .share-text {
    font-family: "Libre Caslon Text", serif;
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

    this.playerRef = React.createRef();

    this.state = {
      loading: false,
      videoIsPlaying: false,
      playlist: {},
      video: undefined
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
      const video =
        VideoRecordings[
          window.location.href
            .split("/")
            .pop()
            .toLowerCase()
        ][Math.floor(Math.random() * 2)];

      const playlist = await this.getPlaylist(
        sign.month,
        sign.day,
        accessToken
      );

      this.setState({
        playlist: playlist,
        loading: false,
        video: video.track
      });
    }
  };

  componentDidMount = () => {};

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
    const { playlist, loading, videoIsPlaying, video } = this.state;

    if (!loading) {
      return (
        <StyledApp>
          <SpinningZodiacWheel />
          <FirstContainer>
            <div className="logo-placeholder" />
          </FirstContainer>
          <SecondContainer>
            <p className="intro-text">{`Your playlist has been saved. Why not share your ${playlist.sign} playlist with your friends.`}</p>
            <HoroscopeVideoContainer>
              {!videoIsPlaying ? (
                <div className="play-video-button">
                  <FaPlay
                    className="play-icon"
                    onClick={() => {
                      this.setState({ videoIsPlaying: true });
                    }}
                  />
                </div>
              ) : null}
              <ReactPlayer
                playsinline={true}
                controls={true}
                ref={el => (this.playerRef = el)}
                className="react-player"
                url={video}
                playing={videoIsPlaying}
                width="100%"
                height="100%"
              />
            </HoroscopeVideoContainer>
            <p className="zodiac-sign">{playlist.sign}</p>
            <SocialMediaContainer>
              <FacebookShareButton
                url={`https://www.starsignsbyti.com/playlist/${playlist.sign}`}
                quote={"Stream The Libra Now"}
                hashtag="#TheLibra"
                className="social-media-btn"
              >
                <SocialMediaIcon>
                  <FaFacebook className="icon-text" />
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
                  <FaTwitter className="icon-text" />
                </SocialMediaIcon>
              </TwitterShareButton>
              <SocialMediaIcon>
                <a href="instagram://story-camera" rel="noopener noreferrer">
                  <TiSocialInstagramCircular />
                </a>
              </SocialMediaIcon>
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
