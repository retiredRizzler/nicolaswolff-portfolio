<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-medium text-highlighted">Client Galleries</h1>
      <UButton
        to="/admin/galleries/new"
        icon="i-heroicons-plus"
      >
        Create New Gallery
      </UButton>
    </div>

    <UCard v-if="loading" class="text-center py-12">
      <div class="flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
      <p class="text-muted mt-4">Loading galleries...</p>
    </UCard>

    <UCard v-else-if="galleries.length === 0" class="text-center py-12">
      <p class="text-muted mb-4">No galleries yet</p>
      <UButton to="/admin/galleries/new" variant="soft">
        Create Your First Gallery
      </UButton>
    </UCard>

    <UCard v-else>
      <UTable
        :data="galleries"
        :columns="columns"
      />
    </UCard>

    <UModal
      v-model:open="deleteModal.open"
      title="Delete Gallery"
      description="This action cannot be undone."
    >
      <template #body>
        <p>
          Are you sure you want to delete "<strong>{{ deleteModal.gallery?.title }}</strong>"?
          This will permanently delete all {{ deleteModal.gallery?.imageCount }} images.
        </p>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="deleteModal.open = false">
            Cancel
          </UButton>
          <UButton
            color="error"
            :loading="deleteModal.loading"
            @click="handleDelete"
          >
            Delete Gallery
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Gallery } from '~/types/admin'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const UButton = resolveComponent('UButton')
const { getGalleries, deleteGallery } = useAdminApi()

const galleries = ref<Gallery[]>([])
const loading = ref(true)

const deleteModal = reactive({
  open: false,
  gallery: null as Gallery | null,
  loading: false
})

const columns: TableColumn<Gallery>[] = [{
  accessorKey: 'clientName',
  header: 'Client',
  cell: ({ row }) => {
    return h('div', { class: 'font-medium text-[#201d1d]' }, row.original.clientName)
  }
}, {
  accessorKey: 'title',
  header: 'Title'
}, {
  accessorKey: 'slug',
  header: 'Slug',
  cell: ({ row }) => {
    return h('code', { class: 'text-xs bg-[#201d1d]/5 px-2 py-1 rounded' }, row.original.slug)
  }
}, {
  id: 'stats',
  header: 'Stats',
  cell: ({ row }) => {
    return h('div', { class: 'text-sm text-[#201d1d]/60' },
      `${row.original.imageCount} images · ${row.original.viewCount} views`
    )
  }
}, {
  accessorKey: 'expiresAt',
  header: 'Expires',
  cell: ({ row }) => {
    if (row.original.expiresAt) {
      return h('span', { class: 'text-sm text-[#201d1d]/60' }, formatDate(row.original.expiresAt))
    }
    return h('span', { class: 'text-sm text-[#201d1d]/40' }, 'Never')
  }
}, {
  id: 'actions',
  header: '',
  cell: ({ row }) => {
    return h('div', { class: 'flex gap-2' }, [
      h(UButton, {
        to: `/admin/galleries/${row.original.id}`,
        variant: 'soft',
        size: 'xs',
        icon: 'i-heroicons-pencil'
      }, () => 'Edit'),
      h(UButton, {
        variant: 'soft',
        size: 'xs',
        color: 'error',
        icon: 'i-heroicons-trash',
        onClick: () => confirmDelete(row.original)
      }, () => 'Delete')
    ])
  }
}]

const loadGalleries = async () => {
  loading.value = true
  try {
    galleries.value = await getGalleries()
  } catch (error) {
    // Error already handled by composable
  } finally {
    loading.value = false
  }
}

const confirmDelete = (gallery: Gallery) => {
  deleteModal.gallery = gallery
  deleteModal.open = true
}

const handleDelete = async () => {
  if (!deleteModal.gallery) return

  deleteModal.loading = true
  try {
    await deleteGallery(deleteModal.gallery.id)
    galleries.value = galleries.value.filter(g => g.id !== deleteModal.gallery!.id)
    deleteModal.open = false
  } catch (error) {
    // Error already handled
  } finally {
    deleteModal.loading = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  loadGalleries()
})
</script>

<style scoped>
* {
  font-family: 'PP Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
</style>
