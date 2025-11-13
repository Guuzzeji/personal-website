<script lang="ts">
  let { onHomeBtnClick = () => {} } = $props();

  let isPlaying = $state(false);
  let isAudioReady = $state(false);
  let volume = $state(0.1);

  function togglePlay() {
    isPlaying = !isPlaying;
  }

  function changeVolume(increase: boolean) {
    if (increase && Math.abs(volume - 0.9) > 0.0001) {
      volume += 0.1;
    } else if (Math.abs(volume - 0.1) > 0.0001) {
      volume -= 0.1;
    }
    console.log(volume);
  }
</script>

<div class="drop-shadow">
  <div class="ipod small">
    <div class="screen pointer-events-none select-none">
      <div class="title-bar">
        {#if !isPlaying}
          <div class="play-icon"></div>
        {:else}
          <div class="pause-icon"></div>
        {/if}
        <div class="title">
          {#if !isPlaying}
            <span class="inline">PLAYING</span>
          {:else if !isAudioReady}
            <span>LOADING</span>
          {:else}
            <span>PAUSED</span>
          {/if}
        </div>
        <div class="battery small"></div>
      </div>
      <div class="menu-options">
        <div class="p-3">
          <div>Tyler Creator RUNITUP.mp3</div>
        </div>
      </div>
    </div>
    <div class="outer-ring">
      <svg viewBox="-150 5 350 350" class="pointer-events-none">
        <path id="curve" d="m0,30 c16,-4 32,-4 48,0" />
        <text>
          <textPath xlink:href="#curve">menu</textPath>
        </text>
      </svg>
      <button onclick={() => changeVolume(true)} class="cursor-pointer">
        <div class="skip forward">&#32;&#32;&#32;</div>
      </button>
      <button onclick={() => changeVolume(false)} class="cursor-pointer">
        <div class="skip back">&#32;&#32;&#32;</div>
      </button>
      <button onclick={togglePlay} class="cursor-pointer">
        <div class="play-pause">&#32;&#32;&#32;</div>
      </button>
      <div class="touch-wheel"></div>
      <button
        onclick={() => {
          onHomeBtnClick();
          isPlaying = false;
        }}
        class="cursor-pointer"
      >
        <div class="center-button"></div>
      </button>
    </div>
  </div>
  <div class="hidden">
    <audio
      loop
      preload="auto"
      playsinline
      autoplay={false}
      bind:paused={isPlaying}
      bind:volume
      oncanplay={() => {
        isAudioReady = true;
      }}
    >
      <source src="/music/RUNITUP.mp3" type="audio/mp3" />
    </audio>
  </div>
</div>

<style>
  :root {
    --light-background: #ffffff;
    --dark-background: #e3e4e5;
    --light-screen-background: #d6d5d0;
    --dark-screen-background: #a5a59b;
    --screen-light: #c1c1ba;
    --screen-dark: #484647;
    --icon-light-grey: #babdc1;
    --light-grey: #f2f2f2;
    --mid-grey: #999999;
    --dark-grey: #595959;
    --very-dark-grey: #4d4d4d;
  }

  .ipod {
    width: 415px;
    height: 692px;
    border: 1px solid transparent;
    border-radius: 38px;
    /* background: linear-gradient(
      45deg,
      var(--dark-background),
      var(--light-background)
    ); */
    box-shadow: inset 5px -5px 15px 0px var(--dark-grey);
  }
  .ipod.small {
    transform: scale(0.67, 0.67);
  }

  .screen {
    position: relative;
    margin: 30px auto 0px auto;
    width: 284px;
    height: 230px;
    background: linear-gradient(
      135deg,
      var(--dark-screen-background),
      var(--light-screen-background)
    );
    border-radius: 10px;
    box-shadow: inset 0px 0px 10px 2px var(--very-dark-grey);
    font-family: "ChicagoFont", "Arial";
    font-size: 130%;
    color: var(--screen-dark);
  }

  .title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 600;
  }

  .title-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 16%;
    border-bottom: 2px solid var(--screen-dark);
    text-align: center;
  }

  .play-icon {
    position: absolute;
    display: inline-block;
    top: 50%;
    left: 10px;
    transform: translate(0, -50%);
    border-left: 18px solid var(--screen-dark);
    border-top: 9px solid transparent;
    border-bottom: 9px solid transparent;
    height: 0;
    width: 0;
  }

  .pause-icon {
    position: absolute;
    top: 30%;
    left: 10px;
    height: 15px;
    width: 10px;
    background: repeating-linear-gradient(
      to right,
      var(--screen-dark),
      var(--screen-dark) 4px,
      transparent 4px,
      transparent 6px,
      var(--screen-dark) 6px,
      var(--screen-dark) 10px
    );
  }

  .battery {
    position: absolute;
    right: 5px;
    height: 50px;
    width: 100px;
    background-color: var(--screen-light);
    border: 5px solid var(--screen-dark);
    &:before {
      content: "";
      position: absolute;
      top: 50%;
      right: -12px;
      transform: translate(0, -50%);
      height: 33%;
      width: 7px;
      background-color: var(--screen-light);
      border-right: 5px solid var(--screen-dark);
      border-top: 5px solid var(--screen-dark);
      border-bottom: 5px solid var(--screen-dark);
    }
    &:after {
      content: "";
      position: absolute;
      top: 5px;
      bottom: 5px;
      left: 5px;
      width: 70px;
      background: repeating-linear-gradient(
        to right,
        var(--screen-dark),
        var(--screen-dark) 20px,
        var(--screen-light) 20px,
        var(--screen-light) 25px,
        var(--screen-dark) 25px,
        var(--screen-dark) 45px,
        var(--screen-light) 45px,
        var(--screen-light) 50px,
        var(--screen-dark) 50px,
        var(--screen-dark) 70px
      );
    }
  }
  .battery.small {
    transform: scale(0.3, 0.3);
    transform-origin: 100% 25%;
  }

  .menu-options {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: relative;
    text-align: center;
    top: 17%;
    height: 81%;
    font: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 600;
  }

  .outer-ring {
    position: relative;
    margin: 0 auto;
    top: 30px;
    height: 350px;
    width: 350px;
    border-radius: 50%;
    /* background-color: var(--light-background); */
    box-shadow: inset 5px -5px 25px -7px var(--dark-grey);
    &:before,
    &:after {
      content: "";
      position: absolute;
      width: 0;
      height: 99%;
      /* border: 1px solid var(--very-dark-grey); */
    }
    &:before {
      left: 50%;
      transform: rotate(45deg);
    }
    &:after {
      top: 0;
      left: 50%;
      transform: rotate(135deg);
    }
  }

  .touch-wheel {
    position: absolute;
    pointer-events: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 276px;
    width: 276px;
    border: 0.5px solid var(--very-dark-grey);
    border-radius: 50%;
    filter: blur(2px);
    /* background: radial-gradient(
      farthest-side at 90% 80%,
      var(--mid-grey),
      var(--light-grey)
    );
    box-shadow: 5px -5px 30px -7px var(--dark-grey); */
    z-index: 1;
  }

  .center-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 100px;
    width: 100px;
    /* border: 2px solid var(--icon-light-grey); */
    border-radius: 50%;
    background-color: orange;
    box-shadow: inset 0px 0px 40px 40px orange;
    /* background: radial-gradient(
      farthest-side at -90% 80%,
      var(--mid-grey),
      var(--light-grey)
    ); */
  }

  text {
    font-family: "Arial";
    font-size: 110%;
    font-weight: bold;
    fill: var(--icon-light-grey);
  }
  path {
    fill: transparent;
  }

  .skip {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    background-color: var(--icon-light-grey);
    height: 12px;
    width: 4px;
    &:before,
    &:after {
      content: "";
      position: absolute;
      border-left: 9px solid var(--icon-light-grey);
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
    }
    &:before {
      left: -9px;
    }
    &:after {
      left: -18px;
    }
  }

  .skip.forward {
    right: 7px;
  }
  .skip.back {
    left: 7px;
    transform: rotate(180deg) translate(0, 50%);
  }

  .play-pause {
    position: absolute;
    bottom: 12px;
    left: 50%;
    height: 0;
    width: 0;
    transform: translate(-13px, 0);
    border-left: 12px solid var(--icon-light-grey);
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    &:before {
      content: "";
      position: absolute;
      bottom: -6px;
      left: 4px;
      height: 12px;
      width: 10px;
      background: repeating-linear-gradient(
        to right,
        var(--icon-light-grey),
        var(--icon-light-grey) 4px,
        transparent 4px,
        transparent 6px,
        var(--icon-light-grey) 6px,
        var(--icon-light-grey) 10px
      );
    }
  }
</style>
