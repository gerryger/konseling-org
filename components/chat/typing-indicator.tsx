export function TypingIndicator() {
  return (
    <div className="cs-bubble-row kawan">
      <div className="cs-bubble-av kawan" aria-hidden="true">K</div>
      <div className="cs-bubble kawan">
        <div className="cs-typing" aria-label="Kawan sedang mengetik">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  )
}
