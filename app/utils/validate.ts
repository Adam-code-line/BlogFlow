/**
 * 表单验证工具函数
 * 提供常用的表单验证逻辑
 */

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
  message?: string
}

export interface ValidationErrors {
  [field: string]: string
}

/**
 * 表单验证器
 */
export class FormValidator {
  private rules: Record<string, ValidationRule[]> = {}
  
  /**
   * 添加验证规则
   */
  addRule(field: string, rule: ValidationRule): this {
    if (!this.rules[field]) {
      this.rules[field] = []
    }
    this.rules[field].push(rule)
    return this
  }
  
  /**
   * 验证单个字段
   */
  validateField(field: string, value: any): string | null {
    const fieldRules = this.rules[field] || []
    
    for (const rule of fieldRules) {
      // 必填验证
      if (rule.required && (value === null || value === undefined || value === '')) {
        return rule.message || `${field}是必填项`
      }
      
      // 最小长度验证
      if (rule.minLength && value && value.length < rule.minLength) {
        return rule.message || `${field}至少需要${rule.minLength}个字符`
      }
      
      // 最大长度验证
      if (rule.maxLength && value && value.length > rule.maxLength) {
        return rule.message || `${field}不能超过${rule.maxLength}个字符`
      }
      
      // 正则验证
      if (rule.pattern && value && !rule.pattern.test(value)) {
        return rule.message || `${field}格式不正确`
      }
      
      // 自定义验证
      if (rule.custom) {
        const result = rule.custom(value)
        if (result) return result
      }
    }
    
    return null
  }
  
  /**
   * 验证整个表单
   */
  validateForm(data: Record<string, any>): ValidationErrors {
    const errors: ValidationErrors = {}
    
    for (const field in this.rules) {
      const error = this.validateField(field, data[field])
      if (error) {
        errors[field] = error
      }
    }
    
    return errors
  }
  
  /**
   * 创建常用验证规则
   */
  static createEmailRule(message?: string): ValidationRule {
    return {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: message || '请输入有效的邮箱地址'
    }
  }
  
  static createPhoneRule(message?: string): ValidationRule {
    return {
      pattern: /^1[3-9]\d{9}$/,
      message: message || '请输入有效的手机号码'
    }
  }
  
  static createUrlRule(message?: string): ValidationRule {
    return {
      pattern: /^https?:\/\/.+/,
      message: message || '请输入有效的URL地址'
    }
  }
}

/**
 * 创建表单验证器的便捷函数
 */
export function createFormValidator(): FormValidator {
  return new FormValidator()
}

/**
 * 联系表单验证器（针对 contact.vue 页面）
 */
export function createContactFormValidator(): FormValidator {
  return new FormValidator()
    .addRule('name', { required: true, minLength: 2, maxLength: 50 })
    .addRule('email', { required: true })
    .addRule('email', FormValidator.createEmailRule())
    .addRule('subject', { required: true })
    .addRule('message', { required: true, minLength: 10, maxLength: 1000 })
}

/**
 * 异步表单提交处理器
 */
export async function handleAsyncFormSubmit<T>(
  formData: T,
  validator: FormValidator,
  submitFn: (data: T) => Promise<void>,
  options: {
    onStart?: () => void
    onSuccess?: () => void
    onError?: (error: any) => void
    onFinally?: () => void
    successMessage?: string
    errorMessage?: string
  } = {}
): Promise<{ success: boolean; errors?: ValidationErrors }> {
  const {
    onStart,
    onSuccess,
    onError,
    onFinally,
    successMessage = '操作成功！',
    errorMessage = '操作失败，请稍后重试'
  } = options
  
  // 验证表单
  const errors = validator.validateForm(formData as Record<string, any>)
  if (Object.keys(errors).length > 0) {
    return { success: false, errors }
  }
  
  try {
    onStart?.()
    await submitFn(formData)
    onSuccess?.()
    
    // 成功提示
    if (process.client) {
      alert(successMessage)
    }
    
    return { success: true }
  } catch (error) {
    onError?.(error)
    
    // 错误提示
    if (process.client) {
      alert(errorMessage)
    }
    
    return { success: false }
  } finally {
    onFinally?.()
  }
}
