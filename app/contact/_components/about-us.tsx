export default function AboutUs() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold mb-2 text-white">About Raydar</h2>
        <p className="text-gray-300">
          Raydar is a dual machine learning application that analyzes and
          matches uploaded sketches of lost items with found items. These found
          items are reported to our database by janitors, students, and anyone
          with a stable internet connection.
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-2 text-white">What We Do</h2>
        <p className="text-gray-300">
          Our mission is to simplify the process of finding lost items on
          college campuses. By leveraging machine learning technology, we
          connect those who have lost items with those who have found them,
          creating a more efficient and effective lost and found system.
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-2 text-white">Our Team</h2>
        <p className="text-gray-300">
          Raydar was created by a dedicated team of students passionate about
          solving real-world problems using technology. Our diverse backgrounds
          in computer science, design, and campus operations allow us to
          approach the lost and found challenge from multiple perspectives.
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-2 text-white">
          Contact Information
        </h2>
        <p className="text-gray-300">
          Email:{" "}
          <a
            href="mailto:contact@raydar.tech"
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            contact@raydar.tech
          </a>
        </p>
      </section>
    </div>
  );
}
