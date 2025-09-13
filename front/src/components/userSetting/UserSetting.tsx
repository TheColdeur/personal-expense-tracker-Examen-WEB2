
import React, { useEffect, useState } from "react";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUserAccount,
} from "./userSettingService";
import type { UserProfile } from "./types";


const UserSetting: React.FC = () => {
  const [tab, setTab] = useState<"profile" | "password" | "delete">("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    getUserProfile()
      .then((res) => {
        const user = res.data.user;
        if (user) {
          setProfile(user);
          setUsername(user.username ?? "");
          setEmail(user.email ?? "");
        }
      })
      .catch((err) =>
        setMessage(err.response?.data?.message || "Erreur chargement profil")
      );
  }, []);

  const handleUpdateProfile = async () => {
    if (!username && !email) {
      setMessage("Veuillez renseigner au moins un champ.");
      return;
    }
    try {
      const res = await updateUserProfile({ username, email });
      const updatedUser = res.data.user;
      if (updatedUser) setProfile(updatedUser);
      setMessage(res.data.message || "Profil mis à jour avec succès");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Erreur mise à jour profil");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      setMessage("Veuillez renseigner les deux champs.");
      return;
    }
    try {
      const res = await changePassword({ currentPassword, newPassword });
      setMessage(res.data.message || "Mot de passe modifié avec succès");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Erreur changement mot de passe");
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setMessage("Veuillez renseigner votre mot de passe pour confirmer.");
      return;
    }
    try {
      const res = await deleteUserAccount({ password: deletePassword });
      setMessage(res.data.message || "Compte supprimé avec succès");
      localStorage.removeItem("token"); // déconnexion automatique
      setProfile(null);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Erreur suppression compte");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">⚙️ Paramètres utilisateur</h2>

      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            tab === "profile" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTab("profile")}
        >
          Profil
        </button>
        <button
          className={`px-4 py-2 rounded ${
            tab === "password" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTab("password")}
        >
          Mot de passe
        </button>
        <button
          className={`px-4 py-2 rounded ${
            tab === "delete" ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTab("delete")}
        >
          Supprimer compte
        </button>
      </div>

      {tab === "profile" && profile && (
        <div>
          <label className="block mb-2">Nom d’utilisateur</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded p-2 mb-4"
          />
          <label className="block mb-2">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded p-2 mb-4"
          />
          <button
            onClick={handleUpdateProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Mettre à jour
          </button>
        </div>
      )}

      {tab === "password" && (
        <div>
          <label className="block mb-2">Mot de passe actuel</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border rounded p-2 mb-4"
          />
          <label className="block mb-2">Nouveau mot de passe</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded p-2 mb-4"
          />
          <button
            onClick={handleChangePassword}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Changer mot de passe
          </button>
        </div>
      )}

      {tab === "delete" && (
        <div>
          <label className="block mb-2">Mot de passe pour confirmer</label>
          <input
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            className="w-full border rounded p-2 mb-4"
          />
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Supprimer le compte
          </button>
        </div>
      )}

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default UserSetting;
