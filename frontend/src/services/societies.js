import axios from "axios";
import { baseUrl } from "../config/api";

export const displaySocieties = async () => {

  const token = localStorage.getItem("token");

  const res = await axios.get(`${baseUrl}/owner/societies`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data;
};

export const addsocieties = async (data) => {

  const token = localStorage.getItem("token");

  const res = await axios.post(
    `${baseUrl}/owner/add-society`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const addFlats = async (data) => {

  const token = localStorage.getItem("token");

  const res = await axios.post(
    `${baseUrl}/owner/add-flat`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getSocietyFlats = async (society_id) => {
  
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${baseUrl}/owner/society-flats/${society_id}` ,{
      headers : {
        Authorization: `Bearer ${token}`,
      }
    }
  );

  return res.json();

};