import React, { Component } from "react";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { withRouter } from "react-router";
import axios from "axios";
import { FaPlay, FaTwitter, FaFacebook } from "react-icons/fa";
import { TiSocialInstagramCircular } from "react-icons/ti";
import { SiApplemusic } from "react-icons/si";
import ReactPlayer from "react-player";
import VideoRecordings from "./VideoRecordings";

const PlaylistContainer = styled.div`
  background: none;
  position: absolute;
  display: flex;
  justify-content: flex-start;

  @media (max-width: 660px) {
    flex-direction: column;
    height: auto;
    justify-content: flex-start;
    align-items: center;
    position: absolute;
    right: 0;
    left: 0;
    margin: 0 auto;
  }

  @media (min-width: 660px) and (max-width: 1350px) {
    align-items: flex-start;
    margin-top: 60px;
  }
`;

const HoroscopeContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 4vw;
  align-items: center;
  justify-content: flex-start;
  width: 400px;
  font-family: "Libre Caslon Text", serif;
  height: 625px;

  @media (max-width: 660px) {
    width: 90vw;
    margin-right: 0;
    justify-content: flex-start;
    margin-top: 15px;
    height: auto;
  }
`;

const HoroscopeVideoContainer = styled.div`
  width: 400px;
  height: 400px;
  background-color: #f8e3b3;
  overflow: hidden;
  border-radius: 10px;
  border: 2px solid #d2a038;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  -webkit-mask-image: -webkit-radial-gradient(white, black);

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

  @media (max-width: 660px) {
    height: 90vw;
    width: 90vw;
  }
`;

const HoroscopeSign = styled.p`
  text-transform: capitalize;
  text-align: center;
  font-weight: 700;
  margin: 0;
  margin-top: 20px;

  @media (max-width: 550px) {
    font-size: 24px;
  }
`;

const HoroscopeText = styled.p`
  text-align: center;
  line-height: 1.2;

  @media (max-width: 500px) {
    line-height: 1.5;
  }
`;

const WebPlaylistInfo = styled.div`
  display: flex;
  width: 32vw;
  flex-direction: column;
  justify-content: center;

  height: 580px;
  font-family: "Libre Caslon Text", serif;

  @media (max-width: 660px) {
    width: 90vw;
    height: auto;
    margin-top: 0px;
  }
`;

const WebSongDetailsContainer = styled.div`
  height: 580px;
  overflow-y: scroll;
  border-radius: 10px;
  border: 2px solid #d2a038;
  background-color: #f8e3b3;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2);

  @media (max-width: 660px) {
    height: 35vh;
    overflow-x: hidden;
    margin-bottom: 20px;
    border: 0px solid black;
  }
`;

const SongContainer = styled.a`
  display: flex;
  width: 90%;
  margin-left: 5%;

  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #000;
  cursor: pointer;

  &:last-child {
    margin-bottom: 20px;
  }

  .playlist-icon {
    font-size: 22px;
    padding-right: 20px;
    color: black;
  }

  .song-name {
    width: 70%;
  }
`;

const Song = styled.p`
  color: #474747;
  font-weight: 400;
`;

const ZodiacSignContainer = styled.div`
  display: flex;
  width: 90%;
  align-items: center;
  justify-content: center;
  margin-left: 5%;

  img {
    width: 50px;
  }
`;

const ZodiacSign = styled.p`
  color: black;
  font-weight: 600;
  padding-left: 10px;
  margin: 15px 0;
  padding-bottom: 5px;
  text-transform: capitalize;
  font-size: 24px;

  @media (max-width: 500px) {
    border: 0px solid black;
  }
`;

const PlayerContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 20px;
`;

const ShareContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  margin-top: 25px;
  width: 100%;

  @media (max-width: 1300px) {
    flex-direction: column-reverse;
    height: 150px;
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
  margin-left: 7px;
  transition: ease-out 0.3s;
  color: #f8e3b3;
  cursor: pointer;

  .apple-music {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.5s all ease;
  }

  .apple-music-icon {
    font-size: 14px;
  }

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
    margin: 0 25px 0 0;
  }

  @media (min-width: 501px) and (max-width: 675px) {
    justify-content: center;

    .share-text {
      display: none;
    }
  }

  @media (max-width: 1300px) {
    margin-bottom: 10px;
  }
`;

class Playlist extends Component {
  constructor(props) {
    super(props);

    const sign = props.playlist.sign.toLowerCase();
    const randomVideoIndex = Math.floor(Math.random() * 2);
    const video = VideoRecordings[sign][randomVideoIndex];

    this.playerRef = React.createRef();

    this.state = {
      deviceId: undefined,
      showNewHoroscopeButton: false,
      randomVideoIndex: randomVideoIndex,
      videoSign: sign,
      videoIsPlaying: false,
      signTranscript: video.transcript,
      video: video.track,
      appleMusicLink:
        "https://music.apple.com/us/album/the-l-i-b-r-a/1535726551"
    };
  }

  componentWillMount = () => {};

  saveSpotifyPlaylist = async () => {
    const { serverUrl, accessToken, userId, playlist } = this.props;

    const url = serverUrl + "/playlist/save";

    await axios({
      method: "POST",
      url,
      data: {
        access_token: accessToken,
        user_id: userId,
        playlist_id: playlist.playlist_id
      }
    })
      .then(res => {
        this.props.history.push(`/playlist/${playlist.sign}`);
      })
      .catch(err => {
        // Handle error
        console.log(err);
      });
  };

  getMobileDeviceId = async () => {
    let deviceId;
    const { serverUrl, accessToken } = this.props;
    const url = serverUrl + "/player/devices";

    await axios({
      method: "GET",
      url,
      params: { access_token: accessToken }
    })
      .then(res => {
        let devices = res.data.devices;
        for (let i = 0; i < devices.length; i++) {
          let device = devices[i];
          if (device.type === "Smartphone") {
            deviceId = device.id;
            return;
          }
        }
      })
      .catch(err => console.log(err));

    return deviceId;
  };

  renderPlaylistSongNames = () => {
    const { playlist } = this.props;
    const playlistId = playlist.playlist_id;

    return playlist.tracks.map((song, i) => {
      return (
        <SongContainer
          key={i}
          href={`https://open.spotify.com/playlist/${playlistId}`}
          target="_blank"
        >
          <Song className="song-name">{song.name}</Song>
          <FaPlay className="playlist-icon" />
        </SongContainer>
      );
    });
  };

  getNewHoroscope = () => {
    const { videoSign, randomVideoIndex } = this.state;
    console.log(videoSign, randomVideoIndex);
    const video =
      randomVideoIndex === 0
        ? VideoRecordings[videoSign][1]
        : VideoRecordings[videoSign][0];

    this.setState({
      signTranscript: video.transcript,
      video: video.track,
      showNewHoroscopeButton: false,
      videoIsPlaying: true,
      randomVideoIndex: randomVideoIndex === 0 ? 1 : 0
    });
  };

  renderMobileStream = () => {
    const {
      signTranscript,
      video,
      appleMusicLink,
      showNewHoroscopeButton
    } = this.state;
    const { playlist } = this.props;

    return (
      <PlaylistContainer>
        <HoroscopeContainer>
          <HoroscopeVideoContainer>
            <ReactPlayer
              playsinline={true}
              ref={el => (this.playerRef = el)}
              className="react-player"
              url={video}
              autoPlay={true}
              width="100%"
              height="100%"
              controls={true}
              onEnded={() => {
                this.setState({ showNewHoroscopeButton: true });
              }}
            />
          </HoroscopeVideoContainer>
          <HoroscopeSign>{playlist.sign}</HoroscopeSign>
          <HoroscopeText>{signTranscript}</HoroscopeText>
          {showNewHoroscopeButton ? (
            <button
              className="save-btn"
              onClick={() => {
                this.getNewHoroscope();
              }}
            >
              Get Another Horoscope
            </button>
          ) : null}
        </HoroscopeContainer>

        <WebPlaylistInfo>
          <ZodiacSignContainer>
            <ZodiacSign
              style={{ textAlign: "center" }}
            >{`${playlist.sign} Horoscope Playlist`}</ZodiacSign>
          </ZodiacSignContainer>

          <WebSongDetailsContainer>
            <iframe
              title="Spotify Web Player"
              src={`https://open.spotify.com/embed/playlist/${playlist.playlist_id}`}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="encrypted-media"
            ></iframe>
          </WebSongDetailsContainer>

          <button
            className="btn save-btn"
            style={{ fontSize: 16 }}
            onClick={() => {
              this.saveSpotifyPlaylist();
            }}
          >
            Save to Spotify
          </button>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 40,
              marginTop: 30
            }}
          >
            <SocialMediaIcon>
              <a href={appleMusicLink} className="apple-music">
                <SiApplemusic className="apple-music-icon" />
              </a>
            </SocialMediaIcon>
            <FacebookShareButton
              url={`https://www.starsignsbyti.com/`}
              quote={"Get your horoscope reading and playlist from T.I."}
              hashtag="#TheLibra"
              className="social-media-btn"
            >
              <SocialMediaIcon>
                <FaFacebook className="icon-text" />
              </SocialMediaIcon>
            </FacebookShareButton>
            <TwitterShareButton
              url={`https://www.starsignsbyti.com/`}
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
          </div>

          <PlayerContainer></PlayerContainer>
        </WebPlaylistInfo>
      </PlaylistContainer>
    );
  };

  renderDesktopStream = () => {
    const {
      signTranscript,
      videoIsPlaying,
      video,
      appleMusicLink,
      showNewHoroscopeButton
    } = this.state;
    const { playlist } = this.props;

    return (
      <PlaylistContainer>
        <HoroscopeContainer>
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
              ref={el => (this.playerRef = el)}
              className="react-player"
              url={video}
              autoPlay={false}
              playing={videoIsPlaying}
              width="100%"
              height="100%"
              onEnded={() => {
                this.setState({
                  videoIsPlaying: false,
                  showNewHoroscopeButton: true
                });
              }}
            />
          </HoroscopeVideoContainer>

          <HoroscopeSign>{playlist.sign}</HoroscopeSign>
          <HoroscopeText>{signTranscript}</HoroscopeText>
          {showNewHoroscopeButton ? (
            <button
              className="save-btn"
              onClick={() => {
                this.getNewHoroscope();
              }}
            >
              Get Another Horoscope
            </button>
          ) : null}
        </HoroscopeContainer>

        <WebPlaylistInfo>
          <WebSongDetailsContainer>
            <ZodiacSignContainer>
              <img
                src={require(`../assets/artwork/${playlist.sign}.jpg`)}
                alt="sign"
              />
              <ZodiacSign>{`${playlist.sign} Horoscope Playlist`}</ZodiacSign>
            </ZodiacSignContainer>
            {this.renderPlaylistSongNames()}
          </WebSongDetailsContainer>

          <ShareContainer>
            <button
              className="save-btn"
              onClick={() => {
                this.saveSpotifyPlaylist();
              }}
            >
              Save to Spotify
            </button>

            <SocialMediaContainer>
              <p className="share-text">Share Playlist</p>
              <div style={{ display: "flex" }}>
                <SocialMediaIcon>
                  <a className="apple-music" href={appleMusicLink}>
                    <SiApplemusic className="apple-music-icon" />
                  </a>
                </SocialMediaIcon>
                <FacebookShareButton
                  url={`https://www.starsignsbyti.com/`}
                  quote={"Get your horoscope reading and playlist from T.I."}
                  hashtag="#TheLibra"
                  className="social-media-btn"
                >
                  <SocialMediaIcon className="icon-text">
                    <FaFacebook className="icon-text" />
                  </SocialMediaIcon>
                </FacebookShareButton>
                <TwitterShareButton
                  url={`https://www.starsignsbyti.com/`}
                  title={`Get your personalized horoscope from T.I.`}
                  hashtag={["#TheLibra"]}
                  related={["tip"]}
                  className="social-media-btn"
                >
                  <SocialMediaIcon>
                    <FaTwitter className="icon-text" />
                  </SocialMediaIcon>
                </TwitterShareButton>
              </div>
            </SocialMediaContainer>
          </ShareContainer>
        </WebPlaylistInfo>
      </PlaylistContainer>
    );
  };

  render() {
    if (isMobile) {
      return this.renderMobileStream();
    } else {
      return this.renderDesktopStream();
    }
  }
}

export default withRouter(Playlist);
