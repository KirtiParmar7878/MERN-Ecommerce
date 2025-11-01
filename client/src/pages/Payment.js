import React, { useEffect, useRef, useState } from "react";
import dropin from "braintree-web-drop-in";

const Payment = () => {
  const dropinInstance = useRef(null);
  const containerRef = useRef(null);
  const [clientToken, setClientToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("10.00");

  useEffect(() => {
    // fetch client token from server
    fetch("/api/v1/payment/token")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.clientToken) setClientToken(data.clientToken);
      })
      .catch((err) => console.error("token err", err));
  }, []);

  useEffect(() => {
    if (clientToken && containerRef.current) {
      dropin.create(
        {
          authorization: clientToken,
          container: containerRef.current,
        },
        (err, instance) => {
          if (err) return console.error(err);
          dropinInstance.current = instance;
        }
      );
    }

    return () => {
      if (dropinInstance.current) {
        dropinInstance.current.teardown().catch(() => {});
      }
    };
  }, [clientToken]);

  const handlePayment = async () => {
    if (!dropinInstance.current) return alert("Payment UI not ready");
    setLoading(true);
    try {
      const payload = await dropinInstance.current.requestPaymentMethod();
      const res = await fetch("/api/v1/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethodNonce: payload.nonce, amount }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Payment successful: " + data.transaction.id);
      } else {
        alert("Payment failed: " + JSON.stringify(data.error || data));
      }
    } catch (err) {
      console.error(err);
      alert("Payment error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Payment</h2>
      <div className="mb-3">
        <label className="form-label">Amount</label>
        <input value={amount} onChange={(e) => setAmount(e.target.value)} className="form-control" />
      </div>
      <div ref={containerRef} />
      <button className="btn btn-primary mt-3" onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay"}
      </button>
    </div>
  );
};

export default Payment;
