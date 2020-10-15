import React, { Component } from "react";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { withRouter } from "react-router";
import SpotifyPlayer from "react-spotify-web-playback";
import axios from "axios";
import { FaPlay } from "react-icons/fa";
import ReactPlayer from "react-player";
import VideoRecordings from "./VideoRecordings";
import Video from "../assets/video/test.mov";

const PlaylistContainer = styled.div`
  background: none;
  position: absolute;
  display: flex;
  align-items: center;
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

  @media (min-width: 660px) and (max-width: 1300px) {
    align-items: flex-start;
    margin-top: 40px;
  }
`;

const HoroscopeContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 4vw;
  align-items: center;
  justify-content: center;
  width: 400px;
  font-family: "Merriweather", serif;

  @media (max-width: 660px) {
    width: 90vw;
    margin-right: 0;
    justify-content: flex-start;
    margin-top: 15px;
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

  @media (max-width: 660px) {
    height: 90vw;
    width: 90vw;
  }
`;

const HoroscopeSign = styled.p`
  text-transform: capitalize;
  text-align: center;
  font-weight: 700;
`;

const HoroscopeText = styled.p`
  text-align: center;
  line-height: 1.2;

  @media (max-width: 500px) {
    line-height: 1;
  }
`;

const WebPlaylistInfo = styled.div`
  display: flex;
  width: 32vw;
  flex-direction: column;
  justify-content: center;
  height: 65vh;
  font-family: "Merriweather", serif;

  @media (max-width: 660px) {
    width: 90vw;
    height: auto;
    margin-top: 25px;
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
    margin-bottom: 20px;
    border: 0px solid black;
  }
`;

const CurrentSong = styled.p`
  color: black;
  font-weight: 700;
`;

const SongContainer = styled.div`
  display: flex;
  width: 90%;
  margin-left: 5%;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #000;
`;

const Song = styled.p`
  color: #474747;
  font-weight: 400;
`;

const ZodiacSignContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const ZodiacSign = styled.p`
  color: black;
  font-weight: 700;
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

const Player = styled.div`
  width: 100%;

  @media (max-width: 500px) {
    margin-bottom: 25px;
  }
`;

const ShareContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;

  width: 100%;

  @media (max-width: 1300px) {
    flex-direction: column-reverse;
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
  color: white;

  :hover {
    background-color: #f8e3b3;
    color: black;
  }

  a {
    color: white;

    :hover {
      color: black;
    }
  }

  .icon-text {
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

    const sign = props.playlist.sign;
    const video =
      VideoRecordings[sign.toLowerCase()][Math.floor(Math.random() * 2)];

    this.state = {
      deviceId: undefined,
      startPlayingMusic: false,
      videoIsPlaying: false,
      signTranscript: video.transcript
    };
  }

  componentWillMount = async () => {
    this.setState({ videoIsPlaying: true });
  };

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

  togglePlayingMusic = () => {
    this.setState({ startPlayingMusic: !this.state.startPlayingMusic });
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
    const { currentSong } = this.state;

    return playlist.tracks.map((song, i) => {
      return (
        <SongContainer key={i}>
          <Song>{song.name}</Song>
          <FaPlay />
        </SongContainer>
      );
    });
  };

  renderMobileStream = () => {
    const { signTranscript, videoIsPlaying } = this.state;
    const { playlist } = this.props;

    return (
      <PlaylistContainer>
        <HoroscopeContainer>
          <HoroscopeVideoContainer>
            <ReactPlayer
              className="react-player"
              url={Video}
              autoPlay={true}
              playing={videoIsPlaying}
              width="100%"
              height="100%"
              controls={true}
            />
          </HoroscopeVideoContainer>
          <HoroscopeSign>{playlist.sign}</HoroscopeSign>
          <HoroscopeText>{signTranscript}</HoroscopeText>
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
            <SocialMediaIcon>
              <a href="instagram://story-camera" rel="noopener noreferrer">
                I
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
      startPlayingMusic,
      signTranscript,
      videoIsPlaying,
      currentSong
    } = this.state;
    const { playlist, accessToken } = this.props;

    let tracks = playlist.tracks.map(track => {
      return track.uri;
    });

    return (
      <PlaylistContainer>
        <HoroscopeContainer>
          <HoroscopeVideoContainer>
            <ReactPlayer
              className="react-player"
              url={Video}
              autoPlay={true}
              playing={videoIsPlaying}
              width="100%"
              height="100%"
              controls={true}
              onEnded={() => {
                this.setState({ startPlayingMusic: true });
              }}
            />
          </HoroscopeVideoContainer>

          <HoroscopeSign>{playlist.sign}</HoroscopeSign>
          <HoroscopeText>{signTranscript}</HoroscopeText>
        </HoroscopeContainer>

        <WebPlaylistInfo>
          <WebSongDetailsContainer>
            <ZodiacSignContainer>
              <ZodiacSign>{`${playlist.sign} Horoscope Playlist`}</ZodiacSign>
            </ZodiacSignContainer>
            {this.renderPlaylistSongNames()}
          </WebSongDetailsContainer>

          <PlayerContainer>
            <ShareContainer>
              <button
                className="save-btn"
                onClick={() => {
                  this.saveSpotifyPlaylist();
                }}
              >
                Save Playlist
              </button>
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
            </ShareContainer>
            {/* <Player>
              <SpotifyPlayer
                name={"Spotify Web (The Libra)"}
                token={accessToken}
                uris={tracks}
                callback={state => {
                  this.setState({ currentSong: state.track.name });
                }}
                // autoPlay={true}
                play={startPlayingMusic}
                persistDeviceSelection
                syncExternalDevice
                styles={{
                  bgColor: "#f8e3b3",
                  sliderColor: "#d2a038",
                  sliderHandleColor: "#d2a038",
                  sliderTrackColor: "#000",
                  trackArtistColor: "#d2a038"
                }}
              />
            </Player> */}
          </PlayerContainer>
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
