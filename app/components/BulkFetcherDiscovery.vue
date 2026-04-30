<template>
  <MpFlex direction="column" gap="6">
    <MpFlex direction="column" gap="1">
      <MpText size="h3">Step 1: Discover Pages</MpText>
      <MpText color="text.secondary">
        Enter a website domain to discover all crawlable pages.
      </MpText>
    </MpFlex>

    <!-- max 6 columns wide per design spec -->
    <MpFlex gap="3" alignItems="flex-end" :class="css({ maxWidth: '600px' })">
      <MpFlex direction="column" flexGrow="1">
        <MpFormControl id="domain" :is-error="!!domainError">
          <MpFormLabel>Website Domain</MpFormLabel>
          <MpInput
            v-model="domain"
            placeholder="https://help.example.com"
            :is-disabled="isDiscovering"
            is-full-width
            @keyup.enter="discoverUrls"
          />
          <MpFormErrorMessage>{{ domainError }}</MpFormErrorMessage>
        </MpFormControl>
      </MpFlex>
      <MpButton
        variant="primary"
        left-icon="search"
        :is-loading="isDiscovering"
        :is-disabled="!domain"
        @click="discoverUrls"
      >
        Discover
      </MpButton>
    </MpFlex>

    <template v-if="!isDiscovering && discoveredUrls.length > 0">
      <MpFlex justifyContent="space-between" alignItems="center">
        <MpText>
          Found <strong>{{ discoveredUrls.length }}</strong> pages
        </MpText>
        <MpText size="body-small" color="text.secondary">
          Selected: {{ selectedCount }} of {{ discoveredUrls.length }}
        </MpText>
      </MpFlex>

      <MpFlex
        paddingX="4"
        paddingY="3"
        backgroundColor="background.subtle"
        borderWidth="1"
        borderColor="border.default"
        rounded="md"
      >
        <MpCheckbox
          id="select-all"
          :is-checked="allSelected"
          :is-indeterminate="isIndeterminate"
          @change="toggleSelectAll"
        >
          Select All
        </MpCheckbox>
      </MpFlex>

      <MpFlex
        direction="column"
        borderWidth="1"
        borderColor="border.default"
        rounded="md"
        :class="css({ overflow: 'hidden' })"
      >
        <MpFlex
          v-for="(item, index) in discoveredUrls"
          :key="item.url"
          paddingX="4"
          paddingY="3"
          gap="3"
          alignItems="center"
          :class="index > 0 ? css({ borderTopWidth: '1px', borderTopColor: 'border.default' }) : ''"
        >
          <MpCheckbox
            :id="`url-${index}`"
            :is-checked="item.selected"
            @change="(val: boolean) => toggleUrl(item.url, val)"
          />
          <MpFlex direction="column" gap="1" flexGrow="1">
            <MpText size="label">{{ item.title }}</MpText>
            <MpText size="body-small" color="text.secondary">{{ item.url }}</MpText>
          </MpFlex>
        </MpFlex>
      </MpFlex>

      <MpButton
        variant="primary"
        :is-disabled="selectedCount === 0"
        @click="startBulkFetch"
      >
        Fetch {{ selectedCount }} Selected Pages
      </MpButton>
    </template>
  </MpFlex>
</template>

<script setup lang="ts">
import { css, MpFlex, MpText, MpButton, MpInput, MpCheckbox, MpFormControl, MpFormLabel, MpFormErrorMessage } from '@mekari/pixel3'
import { useBulkFetcher } from '~/composables/useBulkFetcher'

const {
  domain,
  domainError,
  isDiscovering,
  discoveredUrls,
  selectedCount,
  allSelected,
  isIndeterminate,
  discoverUrls,
  toggleSelectAll,
  toggleUrl,
  startBulkFetch,
} = useBulkFetcher()
</script>
