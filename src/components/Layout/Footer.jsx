function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-4 mt-auto">
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        &copy; {new Date().getFullYear()} CommunityHub. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;