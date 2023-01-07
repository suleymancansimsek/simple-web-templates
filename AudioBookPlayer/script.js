const spectrumComponent = {
    template: "#spectrum-template",
    props: ["pins"],
    data: function () {
      return {
        radius: 50,
        adjust: 0,
        avarage: 0,
        cover_art: null
      };
    },
    mounted: function () {
      const width = this.$el.getBoundingClientRect().width;
      const innerWidth = (width * 100) / 130;
      this.adjust = (width - innerWidth) / 2;
      this.radius = innerWidth / 2;
    },
    methods: {
      valueToPoint: function (value, index) {
        let angle = (360 * index) / this.total - 90;
  
        // convert to radians
        angle = (angle * Math.PI) / 180;
  
        var cos =
          Math.cos(angle) * (this.radius + value) + this.radius + this.adjust;
        var sin =
          Math.sin(angle) * (this.radius + value) + this.radius + this.adjust;
        return `${cos},${sin}`;
      }
    },
    computed: {
      points: function () {
        let avarage_count = 0;
        const retn = this.pins
          .map((p, index) => {
            avarage_count += p;
            return this.valueToPoint(p, index);
          })
          .join(" ");
        this.$emit("avarage", avarage_count / this.total);
  
        return retn;
      },
      total: function () {
        return this.pins.length;
      }
    }
  };
  
  const app = new Vue({
    el: "#app",
    data: {
      handle_clicked: false,
      handle_position: 0,
      bar: null,
      is_playing: false,
      is_loading: true,
      is_error: false,
      error_timeout: null,
      error_msg: "",
      audio_obj: null,
      audio_index: 0,
      duration: 0,
      current_time: 0,
      audio_pins: [],
      analyser: null,
      data_array: [],
      buffered: [],
      speed: 1,
      repeat: false,
      repeat_count: 0,
      list_play: false,
      show_list: false,
      book: book,
      show_info: false,
      cover_art_avarage: 0
    },
    mounted: function () {
      this.bar = this.$refs.bar.getBoundingClientRect();
      let handle = this.$refs.handle;
  
      document.addEventListener("mousedown", this.mouseDown);
      document.addEventListener("mouseup", (e) => (this.handle_click = false));
      document.addEventListener("mousemove", this.moveHandler);
  
      window.addEventListener("resize", this.resizeHandler);
  
      // initiate audio obj
      this.audio_obj = new Audio(this.book.chapters[this.audio_index].link);
      this.audio_obj.crossOrigin = "anonymous";
      this.audio_obj.src = this.book.chapters[this.audio_index].link;
      this.audio_obj.load();
  
      this.audio_obj.addEventListener("loadeddata", () => {
        this.duration = this.audio_obj.duration;
      });
  
      this.audio_obj.addEventListener("ended", this.onEnded);
      this.audio_obj.addEventListener("progress", this.onProgress);
      this.audio_obj.addEventListener("loadedmetadata", this.onProgress);
      this.audio_obj.addEventListener("playing", (e) => (this.is_playing = true));
      this.audio_obj.addEventListener("pause", (e) => (this.is_playing = false));
      this.audio_obj.addEventListener(
        "canplay",
        (e) => (this.is_loading = false)
      );
      this.audio_obj.addEventListener("seeking", (e) => (this.is_loading = true));
  
      this.analyser = audioCtx.createAnalyser();
      this.analyser.fftSize = 2048;
  
      this.bufferLength = this.analyser.frequencyBinCount;
      this.data_array = new Uint8Array(this.bufferLength);
      this.analyser.getByteTimeDomainData(this.data_array);
      this.audio_obj.connect(this.analyser);
  
      this.analyser.smoothingTimeConstant = 0.5;
      this.analyser.connect(audioCtx.destination);
  
      this.visualize();
    },
    methods: {
      visualize: function () {
        this.analyser.getByteFrequencyData(this.data_array);
  
        this.audio_pins = Array.from({ length: 30 }, () => 0);
        for (let i = 0; i < this.audio_pins.length; i++) {
          this.audio_pins[i] =
            (this.data_array[i] + this.data_array[this.audio_pins.length + i]) / 2;
        }
        this.cover_art = this.data_array[0];
  
        this.current_time = this.audio_obj.currentTime;
        requestAnimationFrame(this.visualize);
      },
      onEnded: function (e) {
        if (this.audio_index < this.book.chapters.length - 1) {
          this.next();
        } else {
          this.is_playing = false;
          this.audio_obj.currentTime = 0;
          this.current_time = 0;
          this.handle_position = 0;
        }
      },
      onProgress: function (e) {
        let totalBuffered = 0;
        let bufferedTime = 0;
        let i = 0;
        let ranges = this.audio_obj.buffered;
  
        if (ranges.length > 0) {
          while (!(bufferedTime > this.current_time) && i < ranges.length) {
            bufferedTime += ranges.end(i) - ranges.start(i);
          i++;
        }
        totalBuffered = ranges.end(ranges.length - 1);
      }

      this.buffered = [
        (bufferedTime / this.duration) * 100,
        (totalBuffered / this.duration) * 100
      ];
    },
    onClick: function (e) {
      if (this.is_loading) {
        return;
      }
      if (this.is_playing) {
        this.audio_obj.pause();
      } else {
        this.audio_obj.play();
      }
    },
    mouseDown: function (e) {
      this.handle_clicked = true;
      this.moveHandler(e);
    },
    moveHandler: function (e) {
      if (this.handle_clicked) {
        this.handle_position = e.clientX - this.bar.left;
        let newTime = (this.handle_position / this.bar.width) * this.duration;
        this.current_time = newTime;
        this.audio_obj.currentTime = newTime;
      }
    },
    resizeHandler: function (e) {
      this.bar = this.$refs.bar.getBoundingClientRect();
    },
    next: function (e) {
      this.is_loading = true;
      this.audio_index++;
      this.audio_obj.src = this.book.chapters[this.audio_index].link;
      this.audio_obj.load();
      this.audio_obj.play();
    },
    prev: function (e) {
      this.is_loading = true;
      this.audio_index--;
      this.audio_obj.src = this.book.chapters[this.audio_index].link;
      this.audio_obj.load();
      this.audio_obj.play();
    },
    changeSpeed: function (e) {
      this.speed = e.target.value;
      this.audio_obj.playbackRate = this.speed;
    },
    repeatAudio: function (e) {
      this.repeat = !this.repeat;
    },
    toggleList: function (e) {
      this.show_list = !this.show_list;
    },
    toggleInfo: function (e) {
      this.show_info = !this.show_info;
    },
    onListPlay: function (e) {
      this.audio_index = e;
      this.is_loading = true;
      this.audio_obj.src = this.book.chapters[this.audio_index].link;
      this.audio_obj.load();
      this.audio_obj.play();
      this.show_list = false;
    }
  },
  computed: {
    current_time_formatted: function () {
      let time = Math.floor(this.current_time);
      let minutes = Math.floor(time / 60);
      let seconds = time - minutes * 60;
      return '${minutes}:${seconds.toString().pad}';
    },
    
    Start: function () {
        this.is_loading = true;
        this.audio_obj.src = this.book.chapters[this.audio_index].link;
        this.audio_obj.load();
        this.audio_obj.play();
      }
    }
  });





      
      
  
  