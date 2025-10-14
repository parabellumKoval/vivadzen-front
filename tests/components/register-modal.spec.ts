import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import RegisterModal from '~/components/Modal/Auth/Register/Register.vue'

describe('ModalAuthRegister', () => {
  let registerMock: ReturnType<typeof vi.fn>
  let setNotyMock: ReturnType<typeof vi.fn>
  let closeMock: ReturnType<typeof vi.fn>

  const createStubs = () => ({
    'modal-wrapper': defineComponent({
      template: '<div><slot /></div>',
    }),
    'form-text': defineComponent({
      props: ['modelValue', 'placeholder'],
      emits: ['update:modelValue'],
      template: `
        <input
          :value="modelValue"
          :placeholder="placeholder"
          data-test="form-text"
          @input="$emit('update:modelValue', $event.target.value)"
        />
      `,
    }),
    'form-password': defineComponent({
      props: ['modelValue', 'placeholder'],
      emits: ['update:modelValue'],
      template: `
        <input
          :value="modelValue"
          :placeholder="placeholder"
          type="password"
          data-test="form-password"
          @input="$emit('update:modelValue', $event.target.value)"
        />
      `,
    }),
    'form-checkbox': defineComponent({
      props: ['modelValue'],
      emits: ['update:modelValue'],
      template: `
        <input
          type="checkbox"
          :checked="modelValue"
          data-test="form-checkbox"
          @change="$emit('update:modelValue', $event.target.checked)"
        />
      `,
    }),
    'simple-button-text': defineComponent({
      template: '<button type="button"><slot /></button>',
    }),
    NuxtLink: defineComponent({
      template: '<a><slot /></a>',
    }),
  })

  const mountComponent = () =>
    mount(RegisterModal, {
      global: {
        stubs: createStubs(),
      },
    })

  beforeEach(() => {
    registerMock = vi.fn().mockResolvedValue({})
    setNotyMock = vi.fn()
    closeMock = vi.fn()

    vi.stubGlobal('useAuth', () => ({ register: registerMock }))
    vi.stubGlobal('useI18n', () => ({
      t: (key: string) => key,
      $t: (key: string) => key,
    }))
    vi.stubGlobal('useNoty', () => ({ setNoty: setNotyMock }))
    vi.stubGlobal('useModal', () => ({ close: closeMock, open: vi.fn(), active: { data: null } }))
    vi.stubGlobal('useNuxtApp', () => ({ $regionPath: (path: string) => path }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('submits registration details when form is valid', async () => {
    const wrapper = mountComponent()

    await wrapper.get('input[placeholder="form.enter.email"]').setValue('john@example.com')
    await wrapper.get('input[placeholder="form.enter.password"]').setValue('secret123')
    await wrapper.get('input[placeholder="form.enter.password_confirmation"]').setValue('secret123')
    await wrapper.get('input[data-test="form-checkbox"]').setValue(true)

    await wrapper.get('button.button.primary').trigger('click')
    await nextTick()

    expect(registerMock).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: 'secret123',
    })
    expect(setNotyMock).toHaveBeenCalledWith(
      expect.objectContaining({ content: 'noty.auth.email.confirmation.sent' }),
      10000
    )
    expect(closeMock).toHaveBeenCalled()
  })

  it('shows privacy warning when checkbox is not ticked', async () => {
    const wrapper = mountComponent()

    await wrapper.get('input[placeholder="form.enter.email"]').setValue('john@example.com')
    await wrapper.get('input[placeholder="form.enter.password"]').setValue('secret123')
    await wrapper.get('input[placeholder="form.enter.password_confirmation"]').setValue('secret123')

    await wrapper.get('button.button.primary').trigger('click')
    await nextTick()

    expect(registerMock).not.toHaveBeenCalled()
    expect(setNotyMock).toHaveBeenCalledWith(
      expect.objectContaining({ content: 'noty.auth.register.privacy' })
    )
  })
})
