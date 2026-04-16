<template>
  <v-autocomplete
    v-model="selected"
    :items="sortedCountries"
    item-text="name"
    item-value="iso2"
    label="Country"
    outlined
    dense
    dark
    clearable
    @change="handleChange"
  >
    <template v-slot:item="{ item }">
      <span
        v-if="enabledFlags"
        :class="`flag-icon flag-icon-${item.iso2.toLowerCase()} mr-2`"
      ></span>
      {{ item.name }}
    </template>

    <template v-slot:selection="{ item }">
      <span
        v-if="enabledFlags"
        :class="`flag-icon flag-icon-${item.iso2.toLowerCase()} mr-2`"
      ></span>
      {{ item.name }}
    </template>
  </v-autocomplete>
</template>

<script>
import allCountries from '@/util/allCountries.js'

export default {
  name: 'CountryDropdown',
  props: {
    defaultCountry: { type: String, default: '' },
    preferredCountries: { type: Array, default: () => [] },
    immediateCallSelectEvent: { type: Boolean, default: false },
    enabledFlags: { type: Boolean, default: true },
    enabledCountryCode: { type: Boolean, default: false },
    showNameInput: { type: Boolean, default: true },
  },

  data() {
    return {
      selected: '',
      countries: allCountries
        .filter(c => c.iso2)
        .map(c => ({
          ...c,
          name: (c.name || '').split('/')[0].trim(),
        })),
    }
  },

  computed: {
    sortedCountries() {
      const preferred = this.countries.filter(c =>
        this.preferredCountries.includes(c.iso2)
      )

      const rest = this.countries.filter(c =>
        !this.preferredCountries.includes(c.iso2)
      )

      return [...preferred, ...rest]
    },
  },

  mounted() {
    const code = (this.defaultCountry || '').toUpperCase()

    if (code) {
      this.selected = code
    } else if (this.preferredCountries.length) {
      this.selected = this.preferredCountries[0].toUpperCase()
    }

    if (this.immediateCallSelectEvent && this.selected) {
      this.$nextTick(() => this.emit(this.selected))
    }
  },

  watch: {
    defaultCountry(val) {
      this.selected = (val || '').toUpperCase()
    },
  },

  methods: {
    handleChange(iso2) {
      if (iso2) this.emit(iso2)
    },

    emit(iso2) {
      const country = this.countries.find(
        c => c.iso2 === iso2.toUpperCase()
      )

      if (country) {
        this.$emit('onSelect', {
          name: country.name,
          iso2: country.iso2,
          dialCode: country.dialCode,
        })
      }
    },
  },
}
</script>
