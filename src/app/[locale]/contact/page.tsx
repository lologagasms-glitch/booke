'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Contact() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate single field on blur
    const fieldError: Record<string, string> = {};
    if (name === 'name' && !formData.name.trim()) {
      fieldError.name = 'Le nom est requis';
    } else if (name === 'email' && !formData.email.trim()) {
      fieldError.email = 'L\'email est requis';
    } else if (name === 'email' && formData.email.trim() && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      fieldError.email = 'Format d\'email invalide';
    } else if (name === 'subject' && !formData.subject.trim()) {
      fieldError.subject = 'Le sujet est requis';
    } else if (name === 'message' && !formData.message.trim()) {
      fieldError.message = 'Le message est requis';
    }
    
    setErrors(prev => ({ ...prev, ...fieldError }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true
    });
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setTouched({});
      
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({
        form: 'Une erreur est survenue lors de l\'envoi du formulaire. Veuillez réessayer.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (fieldName: string) => {
    const hasError = errors[fieldName] && touched[fieldName];
    const isValid = formData[fieldName as keyof typeof formData] && !errors[fieldName] && touched[fieldName];
    
    return `w-full px-4 py-3 bg-white/80 border rounded-lg transition-all duration-200 
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white
            disabled:opacity-60 disabled:cursor-not-allowed
            ${hasError ? 'border-red-400 bg-red-50/50 focus:ring-red-400' : ''}
            ${isValid ? 'border-green-400 bg-green-50/30' : 'border-gray-200'}
            hover:border-gray-300`;
  };

  if (submitSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center shadow-lg animate-fade-in">
            <div className="mx-auto mb-4 flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Message envoyé !</h2>
            <p className="text-green-700 mb-4">Nous vous répondrons dans les plus brefs délais.</p>
            <div className="flex items-center justify-center text-sm text-green-600">
              <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Redirection vers l'accueil...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Contactez-nous
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Une question, une suggestion ? Notre équipe vous répond dans les 24 heures.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 lg:p-10">
            {errors.form && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-md animate-shake">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-sm text-red-700 font-medium">{errors.form}</p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  placeholder="Jean Dupont"
                  className={getInputClassName('name')}
                  aria-invalid={!!(errors.name && touched.name)}
                  aria-describedby={errors.name && touched.name ? "name-error" : undefined}
                />
                {errors.name && touched.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {errors.name}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  placeholder="jean.dupont@exemple.com"
                  className={getInputClassName('email')}
                  aria-invalid={!!(errors.email && touched.email)}
                  aria-describedby={errors.email && touched.email ? "email-error" : undefined}
                />
                {errors.email && touched.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <label htmlFor="subject" className="block text-sm font-semibold text-gray-700">
                Sujet <span className="text-red-500">*</span>
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className={getInputClassName('subject')}
                aria-invalid={!!(errors.subject && touched.subject)}
                aria-describedby={errors.subject && touched.subject ? "subject-error" : undefined}
              >
                <option value="" disabled>Sélectionnez un sujet</option>
                <option value="reservation">Question sur une réservation</option>
                <option value="account">Question sur mon compte</option>
                <option value="payment">Question sur un paiement</option>
                <option value="complaint">Réclamation</option>
                <option value="other">Autre</option>
              </select>
              {errors.subject && touched.subject && (
                <p id="subject-error" className="mt-1 text-sm text-red-600 flex items-center">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                  {errors.subject}
                </p>
              )}
            </div>
            
            <div className="mt-6 space-y-2">
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                placeholder="Décrivez votre demande en détail..."
                className={getInputClassName('message')}
                aria-invalid={!!(errors.message && touched.message)}
                aria-describedby={errors.message && touched.message ? "message-error" : undefined}
              />
              {errors.message && touched.message && (
                <p id="message-error" className="mt-1 text-sm text-red-600 flex items-center">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                  {errors.message}
                </p>
              )}
            </div>
            
            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:from-gray-400 disabled:to-gray-500 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <span className={`${isSubmitting ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
                  Envoyer le message
                </span>
                {isSubmitting && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Email</h3>
            <p className="text-gray-600 font-medium">Evasionsms@Evasion.com</p>
          </div>
          
          <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Téléphone</h3>
            <p className="text-gray-600 font-medium">+33 780 997 572</p>
          </div>
          
          <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Adresse</h3>
            <p className="text-gray-600 font-medium">46 Avenue de Trévise, 75009 Paris</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}