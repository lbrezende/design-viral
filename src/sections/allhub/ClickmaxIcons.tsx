/* Ícones oficiais do app Clickmax (extraídos de
   monorepo/web/user/src/components/atoms/icons/icons-sidebar.tsx).
   Traço em currentColor: invertem para branco no estado ativo, igual à
   sidebar do app. NÃO usar pixel-art no hub — estes são os ícones da marca. */

type Props = { size?: number; className?: string }

export function CxFunnels({ size = 20, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M12.083 11.25L16.4222 6.91087C16.5788 6.75421 16.6663 6.54254 16.6663 6.32171V4.16671C16.6663 3.70671 16.293 3.33337 15.833 3.33337H4.16634C3.70634 3.33337 3.33301 3.70671 3.33301 4.16671V6.32171C3.33301 6.54254 3.42051 6.75504 3.57717 6.91087L7.91634 11.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.91699 11.25V16.4575C7.91699 17.135 8.55366 17.6325 9.21116 17.4683L11.2945 16.9475C11.7578 16.8317 12.0837 16.415 12.0837 15.9367V11.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CxPages({ size = 20, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.16667 17.5H13.3333C14.2542 17.5 15 16.74 15 15.8008V6.69917C15 5.76 14.2542 5 13.3333 5H4.16667C3.24583 5 2.5 5.76 2.5 6.69917V15.8008C2.5 16.74 3.24583 17.5 4.16667 17.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.85417 7.07498C4.85167 7.07498 4.85 7.07664 4.85 7.07914C4.85 7.08164 4.85167 7.08331 4.85417 7.08331C4.85667 7.08331 4.85833 7.08164 4.85833 7.07914C4.85833 7.07664 4.85667 7.07498 4.85417 7.07498"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.97331 7.07498C6.97081 7.07498 6.96914 7.07664 6.96914 7.07914C6.96914 7.08164 6.97164 7.08331 6.97331 7.08331C6.97581 7.08331 6.97747 7.08164 6.97747 7.07914C6.97747 7.07664 6.97581 7.07498 6.97331 7.07498"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.08952 7.07498C9.08702 7.07498 9.08535 7.07664 9.08535 7.07914C9.08535 7.08164 9.08702 7.08331 9.08952 7.08331C9.09202 7.08331 9.09368 7.08164 9.09368 7.07914C9.09368 7.07664 9.09202 7.07498 9.08952 7.07498"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.53809 9.16667H14.9998"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66699 5V4.16667C6.66699 3.24583 7.41283 2.5 8.33366 2.5H15.8337C16.7545 2.5 17.5003 3.24583 17.5003 4.16667V13.3333C17.5003 14.2542 16.7545 15 15.8337 15H15.0003"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CxFlows({ size = 20, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <circle
        cx="15.625"
        cy="3.54163"
        r="1.875"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="15.625"
        cy="10"
        r="1.875"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="4.375"
        cy="10"
        r="1.875"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse
        cx="15.625"
        cy="16.4584"
        rx="1.875"
        ry="1.875"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.75 3.54163H11.6667C10.7458 3.54163 10 4.28746 10 5.20829V14.7916C10 15.7125 10.7458 16.4583 11.6667 16.4583H13.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.75 10H6.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CxLeads({ size = 20, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M15.8333 6.66667V4.16667C15.8333 3.24619 15.0871 2.5 14.1667 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.83333 2.5V14.1667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.16667 14.167H4.16667C3.24619 14.167 2.5 14.9132 2.5 15.8337V15.8337C2.5 16.7541 3.24619 17.5003 4.16667 17.5003H8.33333"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.5 17.0814V16.6647C17.5 15.7442 16.7538 14.998 15.8333 14.998H12.9167C11.9962 14.998 11.25 15.7442 11.25 16.6647V17.0814C11.25 17.3115 11.4365 17.498 11.6667 17.498H17.0833C17.3135 17.498 17.5 17.3115 17.5 17.0814Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="14.375"
        cy="11.2497"
        r="1.66667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CxMessages({ size = 20, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.2033 16.59L16.75 4.32333C16.9975 3.655 16.3467 3.005 15.6792 3.2525L3.40833 7.80249C2.64083 8.08749 2.70083 9.19249 3.49499 9.39166L9.18999 10.8225L10.6125 16.5025C10.8125 17.2975 11.9183 17.3583 12.2033 16.59V16.59Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5583 3.44165L9.19165 10.825"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CxSales({ size = 20, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M4.16666 13.2409L8.3925 9.01504C8.71833 8.68921 9.24583 8.68921 9.57083 9.01504L11.355 10.7992C11.6808 11.125 12.2083 11.125 12.5333 10.7992L17.5 5.83337"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.2775 5.83337H17.5V8.05587"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 17.4409H1.60416V2.6842"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CxMembersArea({ size = 20, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M11.6885 14.1035V16.0418C11.6884 16.468 11.9292 16.8576 12.3104 17.0481L12.7456 17.2657C13.3791 17.5823 14.1246 17.5823 14.7581 17.2657L15.1933 17.0481C15.5745 16.8576 15.8153 16.468 15.8152 16.0418V14.1035"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.3446 13.4315L12.9182 14.717C13.4447 14.9797 14.0641 14.9797 14.5906 14.717L17.1617 13.4315C17.373 13.3261 17.5065 13.1103 17.5065 12.8742C17.5065 12.638 17.373 12.4222 17.1617 12.3168L14.5856 11.0313C14.0592 10.7679 13.4396 10.7679 12.9132 11.0313L10.3421 12.3168C10.1311 12.4227 9.99801 12.6388 9.99854 12.8749C9.99907 13.1111 10.1331 13.3266 10.3446 13.4315Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.6696 9.16651V4.16443C16.6696 3.24357 15.9231 2.49707 15.0023 2.49707H4.16443C3.24357 2.49707 2.49707 3.24357 2.49707 4.16443V14.1686C2.49707 15.0895 3.24357 15.836 4.16443 15.836H9.16651"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.70752 9.16635H10.0001"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.70752 5.93588H13.3349"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.10239 9.27056C5.15994 9.27056 5.2066 9.22391 5.2066 9.16635C5.2066 9.1088 5.15994 9.06214 5.10239 9.06214C5.04483 9.06214 4.99818 9.1088 4.99818 9.16635C4.99818 9.22391 5.04483 9.27056 5.10239 9.27056"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.10239 6.04009C5.15994 6.04009 5.2066 5.99344 5.2066 5.93588C5.2066 5.87833 5.15994 5.83167 5.10239 5.83167C5.04483 5.83167 4.99818 5.87833 4.99818 5.93588C4.99818 5.99344 5.04483 6.04009 5.10239 6.04009"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5033 12.8738V14.3744"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CxGeral({ size = 20, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M2.49707 3.33054H17.5033"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M2.49707 9.16635H6.66547"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M2.49707 15.002H6.66547"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.1262 14.5642C15.083 14.5642 16.6693 12.9779 16.6693 11.021C16.6693 9.06422 15.083 7.47791 13.1262 7.47791C11.1693 7.47791 9.58301 9.06422 9.58301 11.021C9.58301 12.9779 11.1693 14.5642 13.1262 14.5642Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M15.4189 13.7305L17.5031 15.8357"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function CxDomains({ size = 20, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 17.5C5.8575 17.5 2.5 14.1425 2.5 10C2.5 5.8575 5.8575 2.5 10 2.5C14.1425 2.5 17.5 5.8575 17.5 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.925 7.50004H17.075"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.925 12.5H11.6667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3333 10C13.3333 7.6967 12.7308 5.39337 11.5275 3.38337C10.8217 2.20587 9.17833 2.20587 8.47333 3.38337C6.065 7.4042 6.065 12.5967 8.47333 16.6175C8.82583 17.2059 9.4125 17.5 10 17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.3125 17.125C17.2092 17.125 17.125 17.21 17.125 17.3125C17.125 17.415 17.2092 17.5 17.3125 17.5C17.415 17.5 17.5 17.4159 17.4992 17.3125C17.5 17.2092 17.4167 17.125 17.3125 17.125"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 15C16.0367 15.0325 15.0325 16.0367 15 17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 17.5C12.5075 16.8675 12.6142 16.275 12.8058 15.7325C13.2958 14.345 14.345 13.2958 15.7333 12.805C16.275 12.6142 16.8675 12.5075 17.5 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CxCloakers({ size = 20, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M12.893 6.0473L13.3872 5.5531C13.7947 5.14582 14.0168 4.5889 14.0015 4.01297C13.9861 3.43703 13.7345 2.89276 13.3059 2.50783C12.4273 1.77287 11.1297 1.84339 10.336 2.66923L9.92578 3.08007"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.44122 4.56396L7.94702 5.05817C7.5395 5.46544 7.31739 6.02237 7.33278 6.5983C7.34817 7.17424 7.5997 7.71851 8.02838 8.10344C8.90702 8.83856 10.2049 8.76774 10.9983 7.94137L11.4085 7.5312"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.0011 8.00006V11.3348C14.0011 12.8082 12.8067 14.0026 11.3333 14.0026H4.66387C3.1905 14.0026 1.99609 12.8082 1.99609 11.3348V4.66534C1.99609 3.19196 3.1905 1.99756 4.66387 1.99756H7.99859"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.9033 4.06934L9.43164 6.5417"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CxIntegrations({ size = 20, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M13.3035 5.03012C14.4543 3.87928 16.3193 3.87928 17.4701 5.03012C18.621 6.18095 18.621 8.04595 17.4701 9.19678L12.571 14.096C11.4201 15.2468 9.55512 15.2468 8.40428 14.096C7.25345 12.9451 7.25345 11.0801 8.40428 9.92928L9.13678 9.19678M6.69678 15.8035C5.54595 16.9543 3.68095 16.9543 2.53012 15.8035C1.37928 14.6526 1.37928 12.7876 2.53012 11.6368L7.42928 6.73762C8.58012 5.58678 10.4451 5.58678 11.596 6.73762C12.7468 7.88845 12.7468 9.75345 11.596 10.9043L10.8335 11.6668"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CxProducts({ size = 20, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.4382 13.3325V6.66754C17.4382 6.0717 17.1207 5.5217 16.6049 5.2242L10.8332 1.8917C10.3174 1.5942 9.68236 1.5942 9.16652 1.8917L3.39486 5.2242C2.87902 5.5217 2.56152 6.07254 2.56152 6.66754V13.3317C2.56152 13.9275 2.87902 14.4775 3.39486 14.775L9.16652 18.1084C9.68236 18.4059 10.3174 18.4059 10.8332 18.1084L16.6049 14.7759C17.1207 14.4784 17.4382 13.9275 17.4382 13.3325Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.1416 10.525L7.6416 11.975"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.78491 5.83417L9.99991 10L17.2149 5.83417"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.99992 18.3333V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.6082 7.91668L6.2832 3.55835"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CxProjects({ size = 20, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M6.6748 14.1667H13.3248"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.6748 10.8327H13.3248"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.8333 7.5H10.4458C10.1675 7.5 9.90667 7.36083 9.7525 7.12917L8.58083 5.37167C8.42583 5.13917 8.16583 5 7.8875 5H4.16667C3.24583 5 2.5 5.74583 2.5 6.66667V15.8333C2.5 16.7542 3.24583 17.5 4.16667 17.5H15.8333C16.7542 17.5 17.5 16.7542 17.5 15.8333V9.16667C17.5 8.24583 16.7542 7.5 15.8333 7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.16699 5V4.16667C4.16699 3.24583 4.91283 2.5 5.83366 2.5H14.167C15.0878 2.5 15.8337 3.24583 15.8337 4.16667V7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CxCommunities({ size = 20, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="9"
        cy="7"
        r="4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 21v-2a4 4 0 0 0-3-3.87"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 3.13a4 4 0 0 1 0 7.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CxWallet({ size = 20, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M13.8292 10.9375C13.6567 10.9384 13.5175 11.0784 13.5175 11.2509C13.5175 11.4234 13.6575 11.5634 13.83 11.5625C14.0025 11.5625 14.1425 11.4225 14.1425 11.25C14.1425 11.0775 14.0025 10.9375 13.8292 10.9375"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 4.16663V15.4166C2.5 16.3375 3.24583 17.0833 4.16667 17.0833H15.8333C16.7542 17.0833 17.5 16.3375 17.5 15.4166V7.08329C17.5 6.16246 16.7542 5.41663 15.8333 5.41663H3.75C3.06 5.41663 2.5 4.85663 2.5 4.16663V4.16663C2.5 3.47663 3.06 2.91663 3.75 2.91663H14.1667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const CX_ICONS = {
  funnels: CxFunnels,
  pages: CxPages,
  flows: CxFlows,
  leads: CxLeads,
  messages: CxMessages,
  sales: CxSales,
  membersarea: CxMembersArea,
  geral: CxGeral,
  domains: CxDomains,
  cloakers: CxCloakers,
  integrations: CxIntegrations,
  products: CxProducts,
  projects: CxProjects,
  communities: CxCommunities,
  wallet: CxWallet,
} as const

export type CxIconName = keyof typeof CX_ICONS
