import {
  useEffect,
  useState
} from "react";

import api from "../services/api";

import {
  useAuth
} from "../context/AuthContext";

function ProfilePage() {
  const {
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

  useEffect(() => {
    const loadProfile =
      async () => {
        const response =
          await api.get(
            "/users/profile"
          );

        const user =
          response.data;

        setForm({
          firstName:
            user.firstName || "",
          lastName:
            user.lastName || "",
          phone: user.phone || "",
          addressLine1:
            user.address
              ?.addressLine1 || "",
          addressLine2:
            user.address
              ?.addressLine2 || "",
          city:
            user.address?.city ||
            "",
          district:
            user.address
              ?.district || "",
          postalCode:
            user.address
              ?.postalCode || "",
          country:
            user.address
              ?.country ||
            "Sri Lanka"
        });
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

      const response =
        await api.put(
          "/users/profile",
          {
            firstName:
              form.firstName,
            lastName:
              form.lastName,
            phone: form.phone,

            address: {
              addressLine1:
                form.addressLine1,
              addressLine2:
                form.addressLine2,
              city: form.city,
              district:
                form.district,
              postalCode:
                form.postalCode,
              country:
                form.country
            }
          }
        );

      setUser(response.data);

      setMessage(
        "Profile updated successfully."
      );
    };

  return (
    <main className="container section">
      <div className="page-heading">
        <span className="eyebrow">
          ACCOUNT
        </span>

        <h1>My Profile</h1>
      </div>

      <form
        className="profile-form"
        onSubmit={handleSubmit}
      >
        {message && (
          <div className="success">
            {message}
          </div>
        )}

        {Object.entries(form).map(
          ([key, value]) => (
            <input
              key={key}
              name={key}
              value={value}
              onChange={handleChange}
              placeholder={
                key
                  .replace(
                    /([A-Z])/g,
                    " $1"
                  )
                  .replace(
                    /^./,
                    (str) =>
                      str.toUpperCase()
                  )
              }
            />
          )
        )}

        <button className="btn btn-dark">
          Save Changes
        </button>
      </form>
    </main>
  );
}

export default ProfilePage;