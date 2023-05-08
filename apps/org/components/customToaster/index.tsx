import toast, { ToastBar, Toaster } from "react-hot-toast"

export function CustomToaster() {
  return (
    <Toaster
      toastOptions={{
        duration: Infinity,
        success: {
          style: {
            background: "#32533D",
            color: "white",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#32533D",
          },
        },
        loading: {
          style: {
            background: "#4C2C72",
            color: "white",
          },
        },

        error: {
          style: {
            background: "red",
            color: "white",
          },
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              <div
                aria-label="Close Notification"
                style={{ cursor: "pointer" }}
                onClick={() => toast.dismiss(t.id)}
              >
                {icon}
              </div>
              {message}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  )
}
