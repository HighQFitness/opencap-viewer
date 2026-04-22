<template>
  <v-autocomplete
    v-model="selected"
    :items="sortedCountries"
    item-text="name"
    item-value="iso2"
    :label="showNameInput ? 'Country' : ''"
    outlined
    dense
    dark
    clearable
    hide-details="auto"
    @change="handleChange"
  >
    <template v-slot:item="{ item }">
      <span
        v-if="enabledFlags"
        :class="`flag-icon flag-icon-${item.iso2.toLowerCase()} mr-2`"
      ></span>
      {{ formatCountryLine(item) }}
    </template>

    <template v-slot:selection="{ item }">
      <span
        v-if="enabledFlags"
        :class="`flag-icon flag-icon-${item.iso2.toLowerCase()} mr-2`"
      ></span>
      {{ formatCountryLine(item) }}
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
      const codes = this.preferredCountries.map(c =>
        String(c || '').toUpperCase()
      )
      const preferredSet = new Set(codes)
      const preferred = codes
        .map(code => this.countries.find(c => c.iso2 === code))
        .filter(Boolean)
      const rest = this.countries.filter(c => !preferredSet.has(c.iso2))
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
    formatCountryLine(item) {
      if (!item) return ''
      const base = item.name || ''
      if (!this.enabledCountryCode || item.dialCode == null || item.dialCode === '') {
        return base
      }
      return `${base} (+${item.dialCode})`
    },

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
