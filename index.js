const { createApp, ref, onMounted } = Vue;

const app = createApp({
  setup() {
    const url = "http://localhost:7000/planet";

    const planet = ref({
      id: null,
      nama_planet: "",
      diameter: "",
      gravitasi: "",
      keterangan: "",
      list: [],
      errorMessage: "",
      isError: false,
      isUpdate: false,
    });

    const getPlanet = async () => {
      try {
        planet.value.isUpdate = false;
        const resPlanet = await axios.get(url);
        if (resPlanet.data.length === 0) throw new Error("Planet gak ada");
        planet.value.list = resPlanet.data;
        return resPlanet.data;
      } catch (err) {
        planet.value.isError = true;
        planet.value.errorMessage = err.message;
        planet.value.isUpdate = false;
      }
    };

    const getPlanetById = async (id) => {
      try {
        const resPlanet = await axios.get(url + `/${id}`);
        if (resPlanet.data.length === 0)
          throw new Error("Planet Tidak Ada");
        planet.value.isUpdate = true;
        planet.value.id = id;
        planet.value.nama_planet = resPlanet.data.nama_planet;
        planet.value.diameter = resPlanet.data.diameter;
        planet.value.gravitasi = resPlanet.data.gravitasi;
        planet.value.keterangan = resPlanet.data.keterangan;
        if (planet.value.keterangan == null) {
          planet.value.keterangan = "-";
        }
        return resPlanet.data;
      } catch (err) {
        planet.value.name = "";
        planet.value.email = "";
        planet.value.nim = "";
        planet.value.isUpdate = false;
        planet.value.isError = true;
        planet.value.errorMessage = err.message;
      }
    };

    // const createPlanet = async () => {
    //   try {
    //     planet.value.isUpdate = false;
    //     console.log("Sukses");
    //     const post = await axios.post(url + "/create", {
    //       nama_planet: planet.value.nama_planet,
    //       diameter: planet.value.diameter,
    //       gravitasi: planet.value.gravitasi,
    //       keterangan: planet.value.keterangan,
    //     });
    //     await getPlanet();
    //     console.log("Sukses");
    //     planet.value.nama_planet = "";
    //     planet.value.isUpdate = false;
    //   } catch (err) {
    //     planet.value.isError = true;
    //     planet.value.errorMessage = err.message;
    //   }
    // };

    const createPlanet = async () => {
      try {
        planet.value.isUpdate = false;
        const post = await axios.post(url + "/create", {
          nama_planet: planet.value.nama_planet,
          diameter: planet.value.diameter,
          gravitasi: planet.value.gravitasi,
          keterangan: planet.value.keterangan,
        });
        planet.value.isError = false;
        planet.value.nama_planet = "";
        planet.value.diameter = "";
        planet.value.gravitasi = "";
        planet.value.isUpdate = false;
        if (!post) throw new Error("Gagal Membuat Planet");
        await getPlanet();
      } catch (err) {
        planet.value.isError = true;
        planet.value.errorMessage = err.message;
      }
    };


    const deletePlanet = async (id) => {
      try {
        planet.value.isUpdate = false;
        const resPlanet = await axios.delete(url + "/delete", {
          data: {
            id,
          },
        });
        if (resPlanet.data.length === 0)
          throw new Error("Planet Tidak Ada");
        planet.value.list = resPlanet.data;
        await getPlanet();
        return resPlanet.data;
      } catch (err) {
        planet.value.isError = true;
        planet.value.errorMessage = err.message;
      }
    };

    const updatePlanet = async () => {
      try {
        planet.value.isUpdate = true;
        const put = await axios.put(url + "/update", {
          id: planet.value.id,
          nama_planet: planet.value.nama_planet,
          diameter: planet.value.diameter,
          gravitasi: planet.value.gravitasi,
          keterangan: planet.value.keterangan,
        });
        planet.value.isError = false;
        planet.value.nama_planet = "";
        planet.value.diameter = "";
        planet.value.gravitasi = "";
        planet.value.keterangan = "";
        planet.value.isUpdate = false;
        planet.value.isError = true;
        if (!put) throw new Error("Gagal Update Planet");
        await getPlanet();
      } catch (err) {
        planet.value.isUpdate = false;
        planet.value.isError = true;
        planet.value.errorMessage = err.message;
      }
    };

    onMounted(async () => {
      await getPlanet();
    });

    return {
      planet,
      createPlanet,
      updatePlanet,
      deletePlanet,
      getPlanetById,
    };
  },
});

app.mount("#app");