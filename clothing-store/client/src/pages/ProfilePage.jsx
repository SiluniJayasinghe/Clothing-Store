import {
  useEffect,
  useState
} from "react";

import api from "../services/api";

import {
  useAuth
} from "../context/AuthContextValue";

function ProfilePage() {
  const {
    user,
    setUser
  } = useAuth();

  const [
    form,
    setForm
  ] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    postalCode: "",
    country: "Sri Lanka"
  });

  const [
    message,
    setMessage
  ] = useState("");

  const [
    error,
    setError
  ] = useState("");

  const [
    saving,
    setSaving
  ] = useState(false);

  useEffect(() => {
    const loadProfile =
      async () => {
        try {
          const response =
            await api.get(
              "/users/profile"
            );

          const profile =
            response.data;

          setForm({
            firstName:
              profile.firstName ||
              "",

            lastName:
              profile.lastName ||
              "",

            phone:
              profile.phone ||
              "",

            addressLine1:
              profile.address
                ?.addressLine1 ||
              "",

            addressLine2:
              profile.address
                ?.addressLine2 ||
              "",

            city:
              profile.address
                ?.city ||
              "",

            district:
              profile.address
                ?.district ||
              "",

            postalCode:
              profile.address
                ?.postalCode ||
              "",

            country:
              profile.address
                ?.country ||
              "Sri Lanka"
          });
        } catch {
          setError(
            "Unable to load your profile."
          );
        }
      };

    loadProfile();
  }, []);

  const handleChange =
    (event) => {
      setForm({
        ...form,

        [event.target.name]:
          event.target.value
      });
    };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setSaving(true);

      setMessage("");

      setError("");

      try {
        const response =
          await api.put(
            "/users/profile",
            {
              firstName:
                form.firstName,

              lastName:
                form.lastName,

              phone:
                form.phone,

              address: {
                addressLine1:
                  form.addressLine1,

                addressLine2:
                  form.addressLine2,

                city:
                  form.city,

                district:
                  form.district,

                postalCode:
                  form.postalCode,

                country:
                  form.country
              }
            }
          );

        setUser(
          response.data
        );

        setMessage(
          "Your profile has been updated."
        );
      } catch (
        saveError
      ) {
        setError(
          saveError.response
            ?.data
            ?.message ||
            "Unable to update your profile."
        );
      } finally {
        setSaving(false);
      }
    };

  const initials =
    `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase();

  return (
    <main className="container section profile-page">
      <div className="page-heading">
        <span className="eyebrow">
          MY ACCOUNT
        </span>

        <h1>
          Profile
        </h1>

        <p className="heading-copy">
          Keep your contact and delivery
          details up to date.
        </p>
      </div>

      <div className="profile-layout">
        <aside className="profile-summary-card">
          <div className="profile-avatar">
            {initials ||
              "B"}
          </div>

          <h2>
            {user?.firstName}{" "}
            {user?.lastName}
          </h2>

          <p>
            {user?.email}
          </p>

          <div className="profile-divider" />

          <span>
            Blush & Bloom member
          </span>
        </aside>

        <form
          className="profile-form-card"
          onSubmit={
            handleSubmit
          }
        >
          <div className="profile-form-heading">
            <h2>
              Personal details
            </h2>

            <p>
              These details are used to
              make checkout quicker.
            </p>
          </div>

          {message && (
            <div className="success">
              {message}
            </div>
          )}

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <div className="form-grid">
            <label className="field">
              <span>
                First name
              </span>

              <input
                name="firstName"
                value={
                  form.firstName
                }
                onChange={
                  handleChange
                }
                required
              />
            </label>

            <label className="field">
              <span>
                Last name
              </span>

              <input
                name="lastName"
                value={
                  form.lastName
                }
                onChange={
                  handleChange
                }
                required
              />
            </label>

            <label className="field full-span">
              <span>
                Phone number
              </span>

              <input
                name="phone"
                value={
                  form.phone
                }
                onChange={
                  handleChange
                }
              />
            </label>
          </div>

          <div className="profile-section-title">
            <h3>
              Delivery address
            </h3>
          </div>

          <div className="form-grid">
            <label className="field full-span">
              <span>
                Address line 1
              </span>

              <input
                name="addressLine1"
                value={
                  form.addressLine1
                }
                onChange={
                  handleChange
                }
              />
            </label>

            <label className="field full-span">
              <span>
                Address line 2
              </span>

              <input
                name="addressLine2"
                value={
                  form.addressLine2
                }
                onChange={
                  handleChange
                }
              />
            </label>

            <label className="field">
              <span>
                City
              </span>

              <input
                name="city"
                value={
                  form.city
                }
                onChange={
                  handleChange
                }
              />
            </label>

            <label className="field">
              <span>
                District
              </span>

              <input
                name="district"
                value={
                  form.district
                }
                onChange={
                  handleChange
                }
              />
            </label>

            <label className="field">
              <span>
                Postal code
              </span>

              <input
                name="postalCode"
                value={
                  form.postalCode
                }
                onChange={
                  handleChange
                }
              />
            </label>

            <label className="field">
              <span>
                Country
              </span>

              <input
                name="country"
                value={
                  form.country
                }
                onChange={
                  handleChange
                }
              />
            </label>
          </div>

          <button
            className="btn btn-primary profile-save"
            disabled={
              saving
            }
          >
            {saving
              ? "Saving..."
              : "Save changes"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default ProfilePage;