if (mapToken && listing?.geometry?.coordinates) {
  mapboxgl.accessToken = mapToken;

  const mapContainer = document.getElementById("map");

  if (mapContainer) {
    const map = new mapboxgl.Map({
      container: "map",
      center: listing.geometry.coordinates,
      zoom: 10,
    });

    new mapboxgl.Marker({ color: "red" })
      .setLngLat(listing.geometry.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(
            `<h4>${listing.location}</h4><p>Exact location will be provided after booking</p>`
          )
          .setMaxWidth("300px")
      )
      .addTo(map);
  }
}