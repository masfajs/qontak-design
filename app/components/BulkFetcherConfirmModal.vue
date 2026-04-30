<template>
  <MpModal
    id="confirm-add-kb-modal"
    :is-open="isOpen"
    is-centered
    @close="$emit('close')"
  >
    <MpModalContent>
      <MpModalHeader>
        Add to Knowledge Base?
        <MpModalCloseButton />
      </MpModalHeader>

      <MpModalBody>
        <MpFlex direction="column" gap="4">
          <MpText>You are about to add the following to your Knowledge Base:</MpText>
          <MpFlex
            direction="column"
            gap="2"
            paddingX="4"
            paddingY="3"
            backgroundColor="background.subtle"
            borderWidth="1"
            borderColor="border.default"
            rounded="md"
          >
            <MpText size="body-small">
              <strong>{{ successCount }}</strong> pages
            </MpText>
            <MpText size="body-small">
              <strong>{{ totalChars.toLocaleString() }}</strong> total characters
            </MpText>
            <MpText size="body-small">
              Source: <strong>{{ domain }}</strong>
            </MpText>
          </MpFlex>
        </MpFlex>
      </MpModalBody>

      <MpModalFooter>
        <MpButtonGroup>
          <MpButton variant="secondary" @click="$emit('close')">Cancel</MpButton>
          <MpButton variant="primary" :is-loading="isSubmitting" @click="handleConfirm">
            Add to Knowledge Base
          </MpButton>
        </MpButtonGroup>
      </MpModalFooter>
    </MpModalContent>
    <MpModalOverlay />
  </MpModal>
</template>

<script setup lang="ts">
import {
  MpFlex,
  MpText,
  MpButton,
  MpButtonGroup,
  MpModal,
  MpModalContent,
  MpModalHeader,
  MpModalBody,
  MpModalFooter,
  MpModalCloseButton,
  MpModalOverlay,
} from '@mekari/pixel3'
import { useBulkFetcher } from '~/composables/useBulkFetcher'

defineProps<{
  isOpen: boolean
  successCount: number
  totalChars: number
  domain: string
}>()

const emit = defineEmits<{
  close: []
}>()

const { isSubmitting, addToKnowledgeBase } = useBulkFetcher()

async function handleConfirm() {
  await addToKnowledgeBase()
  emit('close')
}
</script>
