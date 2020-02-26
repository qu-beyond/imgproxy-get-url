<template>
  <section class="section">
    <div class="container">
      <div class="columns is-multiline">
        <div class="column is-12">
          <div class="has-background-light has-text-centered result-tile">
            <a :href="form.source_url" target="_blank">
              <img :src="resultImg" />
            </a>
          </div>
        </div>
        <section class="column is-12">
          <b-field grouped>
            <b-field label="Mode">
              <b-select v-model="mode" placeholder="Select a mode">
                <option
                  v-for="option in modes"
                  :key="option.id"
                  :value="option.id"
                >
                  {{ option.name }}
                </option>
              </b-select>
            </b-field>
            <b-field v-if="mode === 'resize'" label="Options">
              <b-select
                v-model="form.resizing_type"
                placeholder="Select a type"
              >
                <option
                  v-for="option in resizeOptions"
                  :key="option.key"
                  :value="option.key"
                >
                  {{ option.name }}
                </option>
              </b-select>
            </b-field>
            <b-field label="Gravity">
              <b-select v-model="form.gravity" placeholder="Select a gravity">
                <option
                  v-for="option in gravityOptions"
                  :key="option.key"
                  :value="option.key"
                >
                  {{ option.name }}
                </option>
              </b-select>
            </b-field>
            <b-field label="Source URL" expanded>
              <b-input v-model="form.source_url"></b-input>
            </b-field>
            <b-field label="Format">
              <b-select v-model="form.format" placeholder="Select a format">
                <option
                  v-for="option in extensionOptions"
                  :key="option.key"
                  :value="option.key"
                >
                  {{ option.name }}
                </option>
              </b-select>
            </b-field>
          </b-field>
          <b-field grouped>
            <b-field :label="`Width (${form.width}px)`" expanded>
              <b-slider
                v-model="form.width"
                lazy
                type="is-info"
                :min="1"
                :max="1280"
              ></b-slider>
            </b-field>
            <b-field :label="`Height (${form.height}px)`" expanded>
              <b-slider
                v-model="form.height"
                lazy
                type="is-info"
                :min="1"
                :max="1280"
              ></b-slider>
            </b-field>
            <b-field :label="`Blur (${form.blur})`" expanded>
              <b-slider
                v-model="form.blur"
                lazy
                type="is-info"
                :min="0"
                :max="50"
              ></b-slider>
            </b-field>
            <b-field
              :label="
                form.max_bytes
                  ? `Max Bytes (${form.max_bytes} bytes)`
                  : 'Max Bytes (No Limit)'
              "
              expanded
            >
              <b-slider
                v-model="form.max_bytes"
                lazy
                type="is-info"
                :min="0"
                :max="50000"
              ></b-slider>
            </b-field>
          </b-field>
        </section>
      </div>
    </div>
  </section>
</template>

<script>
import resizeOptions from '../server/api/options/resize'
import extensionOptions from '../server/api/options/extension'
import gravityOptions from '../server/api/options/gravity'

export default {
  name: 'HomePage',
  data() {
    return {
      mode: 'resize',
      modes: [
        {
          id: 'resize',
          name: 'Resize'
        },
        {
          id: 'crop',
          name: 'Crop'
        }
      ],
      resizeOptions,
      extensionOptions,
      gravityOptions,
      form: {
        source_url:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Stunning_blue_hour.png/1280px-Stunning_blue_hour.png',
        resizing_type: 'auto',
        width: 1280,
        height: 300,
        format: 'jpg',
        gravity: 'ce',
        blur: 0,
        max_bytes: 0
      },
      resultImg: null
    }
  },
  computed: {
    apiParams() {
      const params = {
        source_url: this.form.source_url,
        format: this.form.format,
        gravity: this.form.gravity
      }
      if (this.form.blur) {
        params.blur = this.form.blur
      }
      if (this.form.max_bytes) {
        params.max_bytes = this.form.max_bytes
      }
      if (this.mode === 'resize') {
        params.resizing_type = this.form.resizing_type
        params.width = this.form.width
        params.height = this.form.height
      } else {
        params.crop = `${this.form.width}:${this.form.height}`
      }
      return params
    }
  },
  watch: {
    apiParams: {
      handler() {
        this.getImageUrl()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async getImageUrl() {
      try {
        const { data } = await this.$axios.post('/api/url', this.apiParams)
        this.resultImg = data.data[0].imgproxy_url
      } catch (error) {
        // console.error({ error })
      }
    }
  }
}
</script>

<style lang="css" scoped>
.result-tile {
  padding: 1em;
  border-radius: 0.5em;
}
</style>
