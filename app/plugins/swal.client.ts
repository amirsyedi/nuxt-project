import Swal, { type SweetAlertOptions } from 'sweetalert2'

type ConfirmationOptions = Pick<SweetAlertOptions, 'title' | 'text' | 'html'>

export default defineNuxtPlugin(() => {
  const swal = {
    async success(message: string, title = 'Success') {
      await new Promise(resolve => setTimeout(resolve, 2000))

      return Swal.fire({
        icon: 'success',
        title,
        text: message,
        confirmButtonText: 'OK'
      })
    },

    danger(message: string, title = 'Error') {
      return Swal.fire({
        icon: 'error',
        title,
        text: message,
        confirmButtonText: 'OK'
      })
    },

    async confirm(options: ConfirmationOptions = {}): Promise<boolean> {
      const result = await Swal.fire({
        icon: 'info',
        title: options.title ?? 'Are you sure?',
        text: options.text,
        html: options.html,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: false
      })

      return result.isConfirmed
    }
  }

  return {
    provide: {
      swal
    }
  }
})

declare module '#app' {
  interface NuxtApp {
    $swal: {
      success: (message: string, title?: string) => ReturnType<typeof Swal.fire>
      danger: (message: string, title?: string) => ReturnType<typeof Swal.fire>
      confirm: (options?: ConfirmationOptions) => Promise<boolean>
    }
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $swal: NuxtApp['$swal']
  }
}
