function IconBase({
  children,
  size = 20,
  className = "",
  ...props
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (props) => (
  <IconBase {...props}>
    <circle
      cx="11"
      cy="11"
      r="7"
    />

    <path d="m20 20-3.5-3.5" />
  </IconBase>
);

export const HeartIcon = (props) => (
  <IconBase {...props}>
    <path
      d="
        M20.8 4.6
        a5.5 5.5 0 0 0-7.8 0
        L12 5.6
        l-1-1
        a5.5 5.5 0 0 0-7.8 7.8
        l1 1
        L12 21
        l7.8-7.6
        1-1
        a5.5 5.5 0 0 0 0-7.8Z
      "
    />
  </IconBase>
);

export const BagIcon = (props) => (
  <IconBase {...props}>
    <path d="M6 8h12l1 13H5L6 8Z" />
    <path d="M9 9V6a3 3 0 0 1 6 0v3" />
  </IconBase>
);

export const UserIcon = (props) => (
  <IconBase {...props}>
    <circle
      cx="12"
      cy="8"
      r="4"
    />

    <path
      d="
        M4.5 21
        a7.5 7.5 0 0 1 15 0
      "
    />
  </IconBase>
);

export const MenuIcon = (props) => (
  <IconBase {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </IconBase>
);

export const CloseIcon = (props) => (
  <IconBase {...props}>
    <path d="m6 6 12 12M18 6 6 18" />
  </IconBase>
);

export const ArrowRightIcon = (props) => (
  <IconBase {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </IconBase>
);

export const TruckIcon = (props) => (
  <IconBase {...props}>
    <path d="M3 6h11v10H3z" />
    <path d="M14 10h4l3 3v3h-7z" />

    <circle
      cx="7"
      cy="18"
      r="2"
    />

    <circle
      cx="18"
      cy="18"
      r="2"
    />
  </IconBase>
);

export const ShieldIcon = (props) => (
  <IconBase {...props}>
    <path
      d="
        M12 3
        5 6
        v5
        c0 4.6 2.8 8.2 7 10
        4.2-1.8 7-5.4 7-10
        V6
        l-7-3Z
      "
    />

    <path d="m9 12 2 2 4-4" />
  </IconBase>
);

export const SparklesIcon = (props) => (
  <IconBase {...props}>
    <path
      d="
        m12 3
        1.2 3.1
        L16 7.5
        l-2.8 1.4
        L12 12
        l-1.2-3.1
        L8 7.5
        l2.8-1.4
        L12 3Z
      "
    />

    <path
      d="
        m18.5 13
        .8 2
        1.7.9
        -1.7.9
        -.8 2
        -.8-2
        -1.7-.9
        1.7-.9
        .8-2Z
      "
    />
  </IconBase>
);

export const PackageIcon = (props) => (
  <IconBase {...props}>
    <path
      d="
        m12 3
        8 4.5
        v9
        L12 21
        l-8-4.5
        v-9
        L12 3Z
      "
    />

    <path d="m4.5 7.7 7.5 4.2 7.5-4.2M12 12v9" />
  </IconBase>
);

export const TrashIcon = (props) => (
  <IconBase {...props}>
    <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14" />
  </IconBase>
);

export const EditIcon = (props) => (
  <IconBase {...props}>
    <path d="m15 5 4 4M4 20l4.5-1 10.8-10.8a2.1 2.1 0 0 0-3-3L5.5 16 4 20Z" />
  </IconBase>
);

export const CheckIcon = (props) => (
  <IconBase {...props}>
    <path d="m5 12 4 4L19 6" />
  </IconBase>
);