import React, { useContext, useState } from "react";
import CommonContext from "../../contexts/common/CommonContext";

import Loader from "../Loader/Loader";

import AxiosInstance from "../../utilsClient/AxiosInstance";

import { useHistory } from "react-router-dom";

const ProfileEdit = () => {
  const { user, setError, setResponse , setUser } = useContext(CommonContext);

  const history = useHistory();

  const [profile, setProfile] = useState({
    name: user ? user.name : "",
    email: user ? user.email : "",
    about: user ? user.about : "",
    role: user ? user.role : "",
    institute: user ? user.institute : "",
    company: user ? user.company : "",
    cf_handle: user ? user.cf_handle : "",
    cc_handle: user ? user.cc_handle : "",
    ln_link: user ? user.ln_link : "",
    profileImage: null,
  });

  const {
    name,
    email,
    about,
    role,
    institute,
    company,
    cf_handle,
    cc_handle,
    ln_link,
    profileImage,
  } = profile;

  const handleChange = (e) => {
    const { name } = e.target;

    if (name === "profileImage") {
      if (
        !(
          e.target.files[0].type === "image/jpg" ||
          e.target.files[0].type === "image/jpeg" ||
          e.target.files[0].type === "image/png" ||
          e.target.files[0].type === "image/PNG" ||
          e.target.files[0].type === "image/JPG" ||
          e.target.files[0].type === "image/JPEG"
        )
      ) {
        return setError("Error : Prefer uploading an image!");
      }

      if (e.target.files[0].size > 4000000) {
        return setError("Error : File size should be less than 4MB");
      }

      return setProfile({
        ...profile,
        profileImage: e.target.files[0],
      });
    }

    if (name === "institute") {
      return setProfile({
        ...profile,
        institute: e.target.value,
        company: "",
      });
    } else if (name === "company") {
      return setProfile({
        ...profile,
        company: e.target.value,
        institute: "",
      });
    }

    setProfile({
      ...profile,
      [name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role === "student" && (!institute || institute === "")) {
      return setError("Enter your institution");
    }

    if (role === "professional" && (!company || company === "")) {
      return setError("Enter your Company");
    }

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    console.log(profile);

    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("about", about);

    formData.append("role", role);

    if (role === "student") {
      formData.append("institute", institute);
    } else if (role === "professional") {
      formData.append("company", company);
    }
    formData.append("cf_handle", cf_handle);
    formData.append("cc_handle", cc_handle);
    formData.append("ln_link", ln_link);
    formData.append("profileImage", profileImage);

    const res = await AxiosInstance.patch("/user/update", formData, config);

    if (res.data.success === 1) {
      setResponse("Profile Updated");

      setUser(res.data.user)
      return history.push("/user");
    }
    return setError(res.data.msg);
  };

  const moveToProfile = () => {
    history.replace("/user");
  };

  return (
    <div style={{ width: "100vw", display: "flex", justifyContent: "center" }}>
      {user ? (
        <div class="container form__wrapper">
          <h2>Edit Profile</h2>

          <form id="myForm" onSubmit={handleSubmit}>
            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="name">Name</label>
                <input
                  name="name"
                  type="text"
                  class="form-control"
                  id="name"
                  placeholder="Name"
                  value={name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div class="form-group">
              <label for="company">Email</label>
              <input
                name="company"
                type="email"
                class="form-control"
                id="company"
                placeholder="Email"
                value={email}
                onChange={handleChange}
                required
              />
            </div>

            <div class="form-group">
              <label for="exampleTextarea">About</label>
              <textarea
                class="form-control"
                id="exampleTextarea"
                rows="3"
                name="about"
                placeholder="About"
                value={about}
                onChange={handleChange}
              ></textarea>
            </div>

            <div class="form-group">
              <label for="cf_handle">Codeforces handle</label>
              <input
                name="cf_handle"
                type="text"
                class="form-control"
                id="company"
                placeholder="cf_handle"
                value={cf_handle}
                onChange={handleChange}
              />
            </div>
            <div class="form-group">
              <label for="cc_handle">Codechef handle</label>
              <input
                name="cc_handle"
                type="text"
                class="form-control"
                id="company"
                placeholder="cc_handle"
                value={cc_handle}
                onChange={handleChange}
              />
            </div>
            <div class="form-group">
              <label for="ln_link">LinkedIn Profile Link</label>
              <input
                name="ln_link"
                type="text"
                class="form-control"
                id="company"
                placeholder="LinkedIn Profile Link"
                value={ln_link}
                onChange={handleChange}
              />
            </div>
            <div class="container">
              <h4>Select Role</h4>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="role"
                  id="exampleRadios1"
                  value="student"
                  onChange={handleChange}
                />
                <label class="form-check-label" for="exampleRadios1">
                  Student
                </label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="role"
                  id="exampleRadios2"
                  value="professional"
                  onChange={handleChange}
                />
                <label class="form-check-label" for="exampleRadios2">
                  Professional
                </label>
              </div>
            </div>

            {role === "student" ? (
              <div class="form-group">
                <label for="company">Institute</label>
                <input
                  name="institute"
                  type="text"
                  class="form-control"
                  id="company"
                  placeholder="Institute"
                  value={institute}
                  onChange={handleChange}
                />
              </div>
            ) : (
              <div class="form-group">
                <label for="company">Company</label>
                <input
                  name="company"
                  type="text"
                  class="form-control"
                  id="company"
                  placeholder="Company"
                  value={company}
                  onChange={handleChange}
                />
              </div>
            )}

            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="city">City</label>
                <input
                  type="file"
                  name="profileImage"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div class="form__btns">
              <button
                id="cancel"
                class="btn btn-outline-primary"
                onClick={moveToProfile}
              >
                Cancel
              </button>
              <button id="save" class="btn btn-primary" type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="loader">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default ProfileEdit;
